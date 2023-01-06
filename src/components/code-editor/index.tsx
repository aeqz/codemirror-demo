import { h } from 'preact'
import style from './style.css'
import { useRef, useEffect, MutableRef } from 'preact/hooks'
import { EditorView, basicSetup } from 'codemirror'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { StreamLanguage } from '@codemirror/language'
import { haskell } from '@codemirror/legacy-modes/mode/haskell'
import { oneDark } from '@codemirror/theme-one-dark'
import { vim } from '@replit/codemirror-vim'
import { Compartment, Extension, Text } from '@codemirror/state'
import { emacs } from '@replit/codemirror-emacs'
import { Signal, useSignal } from '@preact/signals'

// Code
export type Code = Text

export const codeFromString = (str: string): Code =>
  Text.of(str.split('\n'))

export const codeToString = (code: Code): string =>
  code.toString()

// Theme
export type Theme = "Light" | "Dark"

export const themes: Theme[] = ["Light", "Dark"]

const theme = (t: Theme): Extension => {
  switch (t) {
    case "Light":
      return []
    case "Dark":
      return oneDark
  }
}

// Key bindings
export type KeyBinding = "Default" | "Vim" | "Emacs"

export const keyBindings: KeyBinding[] = ["Default", "Vim", "Emacs"]

const keyBinding = (kb: KeyBinding): Extension => {
  switch (kb) {
    case "Vim":
      return vim()
    case "Emacs":
      return emacs()
    case "Default":
      return []
  }
}

export type Props = {
  code?: Code,
  theme: Theme,
  keyBinding: KeyBinding,
  onCodeEdit?: (code: Code) => void,
}

type LocalState = {
  view: EditorView,
  keyBindingConfig: Compartment,
  themeConfig: Compartment,
}

const CodeEditor = (props: Props) => {
  const ref = useRef() as MutableRef<HTMLDivElement>
  const local = useSignal({}) as Signal<LocalState | undefined>

  useEffect(() => {
    const keyBindingConfig = new Compartment
    const themeConfig = new Compartment
    const view = new EditorView({
      doc: props.code,
      parent: ref.current,
      extensions: [
        keyBindingConfig.of(keyBinding(props.keyBinding)),
        basicSetup,
        keymap.of([indentWithTab]),
        StreamLanguage.define(haskell),
        themeConfig.of(theme(props.theme)),
        EditorView.updateListener.of(e => {
          if (!e.docChanged) return
          props.onCodeEdit?.(e.state.doc)
        }),
      ],
    })

    local.value = { view, keyBindingConfig, themeConfig }
  }, [])

  useEffect(() => {
    if (local.value === undefined) return
    if (local.value.view.state.doc === props.code) return
    local.value.view.dispatch(
      local.value.view.state.update({
        changes: {
          from: 0,
          to: local.value.view.state.doc.length,
          insert: props.code
        }
      })
    )
  }, [props.code])

  useEffect(() => {
    if (local.value === undefined) return
    local.value.view?.dispatch({
      effects: local.value.themeConfig.reconfigure(
        theme(props.theme)
      )
    })
  }, [props.theme])

  useEffect(() => {
    if (local.value === undefined) return
    local.value.view?.dispatch({
      effects: local.value.keyBindingConfig.reconfigure(
        keyBinding(props.keyBinding)
      )
    })
  }, [props.keyBinding])

  return <div class={style.code_editor}>
    <div ref={ref} />
  </div>
}

export default CodeEditor
