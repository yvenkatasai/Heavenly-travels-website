import { useRef, useState, useEffect, type PointerEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';

/** A manual enquiry confirmation, never a payment or an automatic message. */
export default function SlideCommit({
  onConfirm,
  disabled = false,
  holdMs = 1500,
}: {
  onConfirm: () => boolean;
  disabled?: boolean;
  holdMs?: number;
}) {
  const track = useRef<HTMLDivElement>(null),
    drag = useRef<{ id: number; start: number; max: number; pos: number } | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [position, setPosition] = useState(0),
    [done, setDone] = useState(false),
    [dragging, setDragging] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  function confirm() {
    if (disabled || done) return;
    if (onConfirm()) {
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setDone(false);
        setPosition(0);
      }, holdMs);
    } else setPosition(0);
  }
  function start(e: PointerEvent<HTMLButtonElement>) {
    if (disabled || done || e.button !== 0) return;
    const max = Math.max(0, (track.current?.clientWidth || 280) - 56);
    drag.current = { id: e.pointerId, start: e.clientX, max, pos: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }
  function move(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.pos = Math.max(0, Math.min(d.max, e.clientX - d.start));
    setPosition(d.pos);
  }
  function release(e: PointerEvent<HTMLButtonElement>, cancel = false) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (!cancel && d.pos >= d.max * 0.92) confirm();
    else setPosition(0);
  }
  return (
    <div className="slide-commit-group">
      <div
        ref={track}
        className={'slide-commit ' + (done ? 'is-done' : '')}
        data-dragging={dragging}
      >
        <span aria-hidden="true">{done ? 'WhatsApp opened' : 'Slide to WhatsApp'}</span>
        <button
          type="button"
          className="slide-commit-handle"
          disabled={disabled || done}
          aria-label="Open selected package and vehicle in WhatsApp. Drag right, or press Enter."
          style={{ transform: `translateX(${position}px)` }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={(e) => release(e)}
          onPointerCancel={(e) => release(e, true)}
          onLostPointerCapture={(e) => release(e, true)}
          onClick={(e) => {
            if (e.detail === 0) confirm();
          }}
        >
          {done ? <Check size={23} /> : <ArrowRight size={23} />}
        </button>
      </div>
      <button
        type="button"
        className="slide-commit-alternative"
        disabled={disabled || done}
        onClick={confirm}
      >
        Or tap to open WhatsApp ↗
      </button>
      <span className="sr-only" role="status">
        {done ? 'Your message is open in WhatsApp. Check it and tap Send.' : ''}
      </span>
    </div>
  );
}
