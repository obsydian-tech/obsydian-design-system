import React, { useId, useState } from 'react';
import { textStyle } from '../core/Text.jsx';

/* What inline styles cannot say: the placeholder, browser autofill, and the key hint leaving touchscreens. */
const FIELD_CSS = `
[data-obs-well]::placeholder{color:var(--bone-low);opacity:1}
[data-obs-well]:focus::placeholder{color:var(--bone-faint)}
[data-obs-well]:-webkit-autofill,[data-obs-well]:-webkit-autofill:hover,[data-obs-well]:-webkit-autofill:focus{-webkit-text-fill-color:var(--bone);-webkit-box-shadow:0 0 0 1000px var(--field-fill) inset;caret-color:var(--violet-hi);transition:background-color 9999s}
@media (pointer: coarse){[data-obs-keyhint]{display:none!important}[data-obs-well][data-obs-brief]{padding-bottom:20px!important}}
`;

/** Keys for a shortcut inside a field: ⌘ ↵ to draft. Hidden on touchscreens, which have no such keys. */
export function KeyHint({ keys = ['⌘', '↵'], children, style }) {
  return (
    <span data-obs-keyhint="" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...textStyle('caption', 'var(--bone-low)'), pointerEvents: 'none', ...style }}>
      {keys.map((k, i) => (
        <kbd key={i} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, padding: '0 5px',
          font: 'var(--type-caption)', fontSize: 11, lineHeight: 1, color: 'var(--bone-dim)', border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-key)', background: 'var(--hover-wash)', marginRight: i === keys.length - 1 ? 4 : 0 }}>{k}</kbd>
      ))}
      {children}
    </span>
  );
}

/** A text field: a recessed well you can see is for typing, on the page with no card around the form.
    The label is sentence case, above the well, in bone-dim; the placeholder guides ("What are you building?"), it
    never just names the field. Hover warms the edge, focus lights it violet with a 4px ring and a violet caret.
    An invalid field gets the one red, and its sentence is tied to it with aria-describedby and aria-invalid.
    size="brief" is the large well for a brief: the label becomes a question at display size, the well rounds to 16px,
    and keyHint sits inside its lower right. */
export function Field({ label, optional = false, multiline = false, size = 'default', placeholder, value, defaultValue, onChange,
  error, hint, keyHint, rows, disabled = false, type = 'text', autoComplete, name, style, inputStyle, onKeyDown }) {
  const id = 'obs-f-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const brief = size === 'brief';
  const invalid = Boolean(error);
  const Tag = multiline || brief ? 'textarea' : 'input';
  const described = [error ? id + '-err' : null, hint ? id + '-hint' : null].filter(Boolean).join(' ') || undefined;
  const ring = focus ? (invalid ? ', 0 0 0 4px var(--error-ring)' : ', 0 0 0 4px var(--field-ring)') : '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'var(--field-gap)', ...style }}>
      <style>{FIELD_CSS}</style>
      {label ? (
        <label htmlFor={id} style={{ cursor: 'pointer', ...(brief ? { ...textStyle('brief', 'var(--bone)'), marginBottom: 6 } : textStyle('small', 'var(--bone-dim)')) }}>
          {label}
          {optional ? <span style={{ ...textStyle('caption', 'var(--bone-low)'), marginLeft: 6 }}>Optional</span> : null}
        </label>
      ) : null}
      <div style={{ position: 'relative' }}>
        <Tag id={id} name={name} type={Tag === 'input' ? type : undefined} rows={Tag === 'textarea' ? rows || (brief ? 4 : 5) : undefined}
          placeholder={placeholder} value={value} defaultValue={defaultValue} onChange={onChange} onKeyDown={onKeyDown} disabled={disabled}
          autoComplete={autoComplete} aria-invalid={invalid || undefined} aria-describedby={described}
          data-obs-well="" data-obs-brief={brief ? '' : undefined}
          onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ display: 'block', width: '100%', margin: 0, fontFamily: 'var(--font-body)', color: 'var(--bone)', caretColor: 'var(--violet-hi)',
            background: focus ? 'var(--field-fill-focus)' : hover && !disabled ? 'var(--field-fill-hover)' : 'var(--field-fill)',
            border: '1px solid', borderColor: invalid ? 'var(--error-edge)' : focus ? 'var(--violet)' : hover && !disabled ? 'var(--field-edge-hover)' : 'var(--field-edge)',
            borderRadius: brief ? 'var(--radius-lg)' : 'var(--radius-md)', boxShadow: 'var(--shadow-field)' + ring, outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.5 : 1,
            transition: 'border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
            ...(brief
              ? { fontSize: 'clamp(18px, 1.6vw, 21px)', lineHeight: 1.5, padding: keyHint ? '20px 22px 52px' : '20px 22px', minHeight: 168, resize: 'vertical' }
              : Tag === 'textarea'
                ? { fontSize: 17, lineHeight: 1.45, padding: '16px 16px 14px', minHeight: 160, resize: 'vertical' }
                : { fontSize: 17, lineHeight: 1.45, padding: '14px 16px', height: 54 }),
            ...inputStyle }} />
        {keyHint ? <span style={{ position: 'absolute', right: 18, bottom: 16 }}>{keyHint}</span> : null}
      </div>
      {error ? <span id={id + '-err'} style={textStyle('caption', 'var(--error-text)')}>{error}</span> : null}
      {hint ? <span id={id + '-hint'} style={textStyle('caption', 'var(--bone-low)')}>{hint}</span> : null}
    </div>
  );
}
