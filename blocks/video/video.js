/**
 * video — short clips and walkthroughs, poster first.
 *
 * Authored table (cells are found by content, so a missing, extra or reordered row degrades
 * to the poster; nothing authored is rebuilt — every element MOVES into the block, EW1):
 *
 *   | Video (loop)                                  |
 *   | https://…/clip.mp4  (link to DA media / https) |  row 1 — the clip (.mp4)
 *   | <poster picture>                               |  row 2 — required: LCP and fallback
 *   | Short description                              |  row 3 — optional: accessible name
 *
 *   | Video (embed)                                  |
 *   | https://www.youtube.com/watch?v=… | vimeo.com/… |  row 1 — YouTube or Vimeo URL
 *   | <poster picture>                               |  row 2 — poster
 *   | Title                                          |  row 3 — iframe title + button name
 *
 *   | Video                                          |  default: a plain .mp4 with controls
 *   | https://…/walkthrough.mp4 · <poster> · caption |  (a YouTube/Vimeo link acts as embed)
 *
 * loop: the <video muted playsinline loop preload="none"> is created only when the block nears
 *   the viewport, motion is allowed and Save-Data is off; it plays at ≥ 50% visible and pauses out
 *   of view or in a hidden tab. A Pause toggle (aria-pressed, WCAG 2.2.2) sits on the frame.
 *   Any media error removes the video: the poster stays.
 * embed: the poster and a Play button; the iframe (youtube-nocookie / player.vimeo.com) is
 *   inserted on activation only — no request to the video host before.
 * The frame takes the poster's aspect ratio (16:9 without one), so nothing shifts.
 */
import {
  imageSize, textOf, thumbPicture, videoSource,
} from '../../scripts/utils.js';

const URL_TEXT = /^https?:\/\/\S+$/;

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

/** cells classified by content: the source link, the poster, the text */
function parse(block) {
  const out = {
    src: null, holders: [], poster: null, text: [],
  };
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const pic = cell.querySelector('picture') || cell.querySelector('img');
    if (pic && !out.poster) {
      out.poster = pic;
      return;
    }
    if (pic) return;
    const links = [...cell.querySelectorAll('a[href]')];
    const authored = cell.querySelector('video[src], video source[src]');
    let found = null;
    links.some((a) => {
      found = videoSource(a.getAttribute('href'));
      return found;
    });
    if (!found && authored) found = videoSource(authored.getAttribute('src'));
    if (!found && !links.length && URL_TEXT.test(textOf(cell))) found = videoSource(textOf(cell));
    if (found) {
      if (!out.src) out.src = found;
      out.holders.push(...cell.childNodes);
      return;
    }
    if (textOf(cell) && !out.text.length) out.text = [...cell.childNodes];
  });
  return out;
}

function imgOf(pic) {
  return pic && (pic.tagName === 'IMG' ? pic : pic.querySelector('img'));
}

/* the poster URL the page already downloaded (a cache hit), once it is known */
function whenPoster(img, fn) {
  if (!img) return;
  const set = () => { if (img.currentSrc || img.src) fn(img.currentSrc || img.src); };
  if (img.complete && img.naturalWidth) set();
  else img.addEventListener('load', set, { once: true });
}

function mediaVideo(src) {
  const v = el('video', 'video-media');
  v.setAttribute('playsinline', '');
  v.playsInline = true;
  v.preload = 'none';
  v.src = src.url;
  return v;
}

function loop(frame, src, img, nameId) {
  if (!src || src.kind !== 'file' || !('IntersectionObserver' in window)) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lessData = () => (navigator.connection && navigator.connection.saveData)
    || window.matchMedia('(prefers-reduced-data: reduce)').matches;

  let video = null;
  let toggle = null;
  let viewIO = null;
  let inView = false;
  let held = false; // paused by the visitor: nothing restarts it but the toggle

  const sync = () => toggle && toggle.setAttribute('aria-pressed', String(held));
  const play = (force) => {
    if (!video || held || (!force && (!inView || document.hidden))) return;
    const p = video.play();
    if (p) {
      p.catch((e) => {
        // autoplay refused (low-power mode, policy): the poster stays, the toggle offers Play
        if (e && e.name === 'NotAllowedError') {
          held = true;
          sync();
        }
      });
    }
  };
  const pause = () => { if (video && !video.paused) video.pause(); };
  const teardown = () => {
    if (viewIO) viewIO.disconnect();
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    }
    if (toggle) toggle.remove();
    video = null;
    toggle = null;
    frame.classList.remove('is-playing');
  };

  const build = () => {
    if (video || reduced.matches) return;
    video = mediaVideo(src);
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.loop = true;
    video.disablePictureInPicture = true;
    video.setAttribute('disableremoteplayback', '');
    if (nameId) video.setAttribute('aria-labelledby', nameId);
    else video.setAttribute('aria-label', (img && img.alt) || 'Video');
    whenPoster(img, (url) => { if (video) video.poster = url; });
    video.addEventListener('playing', () => frame.classList.add('is-playing'));
    video.addEventListener('error', teardown, { once: true });

    toggle = el('button', 'video-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Pause video');
    if (nameId) toggle.setAttribute('aria-describedby', nameId);
    toggle.addEventListener('click', () => {
      held = !held;
      sync();
      if (held) pause();
      else play(true);
    });
    sync();
    frame.append(video, toggle);

    viewIO = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      // ≥ 50% of the clip, or half the viewport for a clip taller than twice the viewport
      const half = e.intersectionRatio >= 0.5
        || (e.rootBounds && e.intersectionRect.height >= e.rootBounds.height * 0.5);
      if (e.isIntersecting && half) {
        inView = true;
        play();
      } else if (!e.isIntersecting) {
        inView = false;
        pause();
      }
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    viewIO.observe(frame);
  };

  const nearIO = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    nearIO.disconnect();
    if (reduced.matches || lessData()) return;
    // the poster (the LCP) settles before the clip is requested
    if (img && !img.complete) {
      img.addEventListener('load', build, { once: true });
      img.addEventListener('error', build, { once: true });
    } else build();
  }, { rootMargin: '300px 0px' });
  nearIO.observe(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else play();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) teardown(); });
}

function embed(frame, src, title) {
  if (!src) return;
  const btn = el('button', 'video-play');
  btn.type = 'button';
  const label = el('span', 'video-play-label');
  label.textContent = 'Play';
  const hidden = el('span', 'visually-hidden');
  hidden.textContent = ` video${title ? `: ${title}` : ''}`;
  btn.append(el('span', 'video-play-icon'), label, hidden);
  btn.addEventListener('click', () => {
    let media;
    if (src.kind === 'file') {
      media = mediaVideo(src);
      media.controls = true;
      media.autoplay = true;
      if (title) media.setAttribute('aria-label', title);
    } else {
      media = el('iframe', 'video-media');
      media.src = src.player;
      media.title = title || 'Video';
      media.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      media.allowFullscreen = true;
      media.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    frame.classList.add('is-playing');
    btn.replaceWith(media);
    media.focus();
  }, { once: true });
  frame.append(btn);
}

function plain(frame, src, img, nameId) {
  if (!src || src.kind !== 'file') return;
  const video = mediaVideo(src);
  video.controls = true;
  if (nameId) video.setAttribute('aria-labelledby', nameId);
  whenPoster(img, (url) => { video.poster = url; });
  video.addEventListener('playing', () => frame.classList.add('is-playing'));
  // a file that fails keeps the poster
  video.addEventListener('error', () => {
    video.remove();
    frame.classList.remove('is-playing');
  }, { once: true });
  frame.append(video);
}

export default function decorate(block) {
  const {
    src, holders, poster, text,
  } = parse(block);
  const isLoop = block.classList.contains('loop');
  const isEmbed = block.classList.contains('embed')
    || (!isLoop && src && src.kind !== 'file');

  const frame = el('div', 'video-frame');
  const img = imgOf(poster);
  if (poster) {
    poster.classList.add('video-poster');
    thumbPicture(poster, { desktop: 2000, mobile: 1000 });
    const first = block.closest('.section') === document.querySelector('main .section');
    if (img && first) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    const { w, h } = imageSize(img);
    frame.style.aspectRatio = `${w} / ${h}`;
    frame.append(poster);
  } else block.classList.add('no-poster');

  const parts = [frame];
  let nameId = '';
  const title = text.map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  if (text.length) {
    const caption = el('div', 'video-caption');
    nameId = `video-${document.querySelectorAll('.video-caption').length + 1}-name`;
    caption.id = nameId;
    caption.append(...text);
    // loop: the description names the clip; it is not printed
    if (isLoop) caption.hidden = true;
    parts.push(caption);
  }
  if (img && !img.hasAttribute('alt')) img.alt = title;
  if (holders.length) {
    const keep = el('div', 'video-source');
    keep.hidden = true;
    keep.append(...holders);
    parts.push(keep);
  }
  block.replaceChildren(...parts);

  if (isLoop) loop(frame, src, img, nameId);
  else if (isEmbed) embed(frame, src, title);
  else plain(frame, src, img, nameId);
}
