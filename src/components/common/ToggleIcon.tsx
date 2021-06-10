import styles from './common.module.css';

export default function ToggleIcon({ width = 16, height = 16 }: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      className={styles.icon}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 32 32"
      width={width}
      height={height}
    >
      <g>
        <g id="transfer">
          <g>
            <polygon points="32,24 7.992,24 7.992,28 0,22 7.992,16 7.992,20 32,20" />
            <polygon points="0,12 24,12 24,16 32,10 24,4 24,8 0,8" />
          </g>
        </g>
      </g>
    </svg>
  );
}
