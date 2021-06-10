import styles from './common.module.css';

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
};

export default function Button({ className = styles.button, ...props }: ButtonProps): JSX.Element {
  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
}
