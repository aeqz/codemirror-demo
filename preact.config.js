export default (config, env) => {
  if (env.production)
    config.output.publicPath = '/codemirror-demo/'
}