# Secure code

## Android

- [x] ProGuard added

## iOS:

## Both

- [x] Obfuscate bundle code

## How to generate obfuscated Configs

- Change config in Encryption.test.js to appropriate environment
- Run unit test to generate encrypted value of environment

```
yarn test Encryption.test.js
```

- Update encrypted values to .env.<environment> (Eg: .env.qa)
