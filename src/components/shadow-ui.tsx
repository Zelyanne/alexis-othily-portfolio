import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ShadowCardProps = ComponentPropsWithoutRef<'article'>
type PillProps = ComponentPropsWithoutRef<'span'>
type ArrowButtonProps = ComponentPropsWithoutRef<'a'>
type FocusRowProps = ComponentPropsWithoutRef<'article'> & {
  children: ReactNode
  number: string
}

export function ShadowCard({ className = '', ...props }: ShadowCardProps) {
  return <article className={`shadowCard ${className}`.trim()} {...props} />
}

export function Pill({ className = '', ...props }: PillProps) {
  return <span className={`pill ${className}`.trim()} {...props} />
}

export function ArrowButton({ children, className = '', ...props }: ArrowButtonProps) {
  return (
    <a className={`arrowButton ${className}`.trim()} {...props}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="statCard">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

export function FocusRow({ children, className = '', number, ...props }: FocusRowProps) {
  return (
    <article className={`focusRow ${className}`.trim()} {...props}>
      <span className="focusRowNumber" aria-hidden="true">
        {number}
      </span>
      <div className="focusRowBody">{children}</div>
      <span className="focusRowArrow" aria-hidden="true">
        →
      </span>
    </article>
  )
}
