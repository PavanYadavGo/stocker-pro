declare module "react-sparklines" {
  import * as React from "react"

  interface SparklinesProps {
    data: number[]
    limit?: number
    width?: number
    height?: number
    margin?: number
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode  // <-- add this line
  }

  export class Sparklines extends React.Component<SparklinesProps> {}

  interface SparklinesLineProps {
    color?: string
    style?: React.CSSProperties
  }

  export class SparklinesLine extends React.Component<SparklinesLineProps> {}
}
