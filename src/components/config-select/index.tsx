import { ComponentChildren, h } from 'preact'
import style from './style.css'

export type Props<A> = {
  name: string,
  options: A[],
  current: A,
  select: (a: A) => void,
}

type ConfigSelect = <A extends ComponentChildren>(props: Props<A>) => h.JSX.Element

const ConfigSelect: ConfigSelect = props =>
  <div class={style.config_select}>
    <p>{props.name}:</p>
    <div class={style.options}>
      {props.options.map((o, i) =>
        <a
          key={i}
          class={o === props.current ? style.selected : undefined}
          onClick={() => props.select(o)}>
          {o}
        </a>
      )}
    </div>
  </div>

export default ConfigSelect
