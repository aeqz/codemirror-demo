import { h } from 'preact'
import style from './style.css'
import { useState } from 'preact/hooks'
import CodeEditor, { KeyBinding, Theme, codeFromString, keyBindings, themes } from '../../components/code-editor'
import ConfigSelect from '../../components/config-select';

const initialCode = `module Main where

import Universum

import MyMonad

main :: IO ()
main = runMyMonad $ do
  result <- stuff
  case result of
    Foo f -> throwError $ MyError f
    Bar b -> do
      moreStuff b
      bye
`

const Home = () => {
  const [code, setCode] = useState(codeFromString(initialCode))
  const [keyBinding, setKeyBinding] = useState("Default" as KeyBinding)
  const [theme, setTheme] = useState("Light" as Theme)
  return <div class={style.editor}>
    <p> This is a <a href={"https://codemirror.net"} rel="noreferrer" target={"_blank"}>CodeMirror</a> demo for
      trying some configurations and customizations.
    </p>
    <p> From the documentation, its style can be customized with CSS <a href={"https://codemirror.net/examples/styling/#old-fashioned-css"} rel="noreferrer" target={"_blank"}>in the traditional way</a>, taking
      precedence over styles generated by code (e.g. themes). <a href={"https://codemirror.net/examples/styling/#things-you-can-style"} rel="noreferrer" target={"_blank"}>Here</a> they
      list the different CSS classes that you can extend (e.g. cursor, line, scroll, selection, etc) with the
      usual CSS styling capabilities (e.g. sizes, fonts, colors, border, margins, etc).
    </p>
    <p> Besides that, you can also define your
      own <a href={"https://codemirror.net/examples/styling/#themes"} rel="noreferrer" target={"_blank"}>themes</a> and <a href={"https://codemirror.net/examples/styling/#highlighting"} rel="noreferrer" target={"_blank"}> syntax highlighting</a>, and
      even add more complex custom elements with some
      provided <a href={"https://codemirror.net/examples/decoration/"} rel="noreferrer" target={"_blank"}>techniques</a>.
    </p>

    <ConfigSelect
      name={"Builtin themes"}
      options={themes}
      current={theme}
      select={setTheme}
    />

    <ConfigSelect
      name={"Key bindings"}
      options={keyBindings}
      current={keyBinding}
      select={setKeyBinding}
    />

    <p> Code editor with basic setup, tab indentation handling,
      Haskell syntax highlighting, and dynamic theme and key binding
      configuration managed with the above buttons:
    </p>

    <CodeEditor
      code={code}
      onCodeEdit={setCode}
      theme={theme}
      keyBinding={keyBinding}
    />
  </div>
}

export default Home
