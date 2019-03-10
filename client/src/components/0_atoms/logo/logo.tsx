import React from 'react'

interface IBackgroundProps {
  /** Logo size */
  size?: number
  /** Style properties */
  style?: React.CSSProperties
  /** Additional CSS UI class */
  className?: string
}

export const Logo = React.memo(({ size = 100, ...rest }: IBackgroundProps) => (
  <svg
    version="1.1"
    enableBackground={`new 0 0 100 100`}
    height={`${size}px`}
    viewBox={`0 0 100 100`}
    width={`${size}px`}
    xmlSpace="preserve"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...rest}
  >
    <path
      style={{
        animationName: 'bubble',
        animationDuration: '15s',
        animationIterationCount: 'infinite',
        animationDelay: '2s',
        transformOrigin: 'center'
      }}
      d="M33,36.89v24h8v8l9-8h17v-24H33z M56,54.39H45c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5h11c0.828,0,1.5,0.672,1.5,1.5  S56.828,54.39,56,54.39z M56,46.39H45c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5h11c0.828,0,1.5,0.672,1.5,1.5  S56.828,46.39,56,46.39z"
    />
    <path
      style={{
        animationName: 'rotate',
        animationDuration: '15s',
        animationIterationCount: 'infinite',
        animationDelay: '3s',
        transformOrigin: 'center'
      }}
      d="M84.049,66.2c2.348-4.909,3.672-10.401,3.672-16.201C87.72,29.227,70.883,12.391,50.109,12.39  c-7.839-0.001-15.132,2.403-21.158,6.51c-0.685,0.467-0.861,1.4-0.395,2.085c0.466,0.685,1.399,0.861,2.084,0.396v-0.001  c5.55-3.779,12.245-5.989,19.469-5.989c9.563,0.001,18.206,3.871,24.475,10.137c6.266,6.268,10.136,14.91,10.137,24.473  c0,5.213-1.158,10.149-3.221,14.579L73,59.171l1.768,17.719l16.795-5.91L84.049,66.2z"
    />
    <path
      style={{
        animationName: 'rotate',
        animationDuration: '15s',
        animationIterationCount: 'infinite',
        animationDelay: '3s',
        transformOrigin: 'center'
      }}
      d="M71.479,79.15c-0.463-0.688-1.395-0.87-2.082-0.407v-0.001c-5.514,3.707-12.141,5.867-19.287,5.868  c-9.562-0.001-18.205-3.872-24.473-10.138C19.371,68.204,15.501,59.562,15.5,49.999c0-5.153,1.132-10.033,3.15-14.421L27,40.89  l-1.768-17.719l-16.795,5.91l7.662,4.874c-2.302,4.868-3.6,10.305-3.599,16.044c0.001,20.772,16.838,37.61,37.609,37.611  c7.756,0,14.974-2.351,20.961-6.379C71.758,80.77,71.94,79.838,71.479,79.15z"
    />
  </svg>
))
