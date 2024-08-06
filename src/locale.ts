import translation from 'zod-i18n-map/locales/ja/zod.json'

// エラー文を独自にカスタム
// ------------------------------
const myTranslation = {
  ...translation,
  errors: {
    ...translation.errors,
    invalid_type_received_undefined: '必須項目です。',
    invalid_type_received_null: '必須項目です。',
    too_small: {
      ...translation.errors.too_small,
      string: {
        exact: '{{minimum}}文字の文字列である必要があります。',
        inclusive: '必須項目です。',
        not_inclusive: '必須項目です。',
      },
    },
  },
}

export const i18nextProps = {
  lng: 'ja',
  resources: {
    ja: { zod: myTranslation },
  },
  interpolation: {
    skipOnVariables: false,
  },
}
