# <p align='center'> Projeto Sing me a song 🎙️ </p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-CECÍLIA_SIMAN_SALEMA-4dae71?style=flat-square" />
</p>

##  :clipboard: Descrição

Um aplicativo para compartilhar recomendações de música por meio de links do YouTube. O código foi fornecido pela [Driven], produzi apenas os testes. 

***
[Driven]:https://github.com/driven-projects/sing-me-a-song
## :computer:	 Tecnologias e Conceitos

- Prisma
- Jest & supertest
- Cypress
- Faker

***


## 🏁 Rodando a aplicação

Certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/Cecilia-Siman/projeto21.git
```

Depois, dentro das pastas de front-end e back-end, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor, no back

```
npm run dev
```

No front 

```
npm start
```

## 🧪 Testando a aplicação

Para executar testes de integração no back-end, utilize

```
npm test -- integrationTesting.test.ts
```

Para executar os testes unitários, também no back-end,

```
npm test -- unitaryTesting.test.ts
```

Para executar ambos os testes e testar a cobertura
```
npm run coverage
```

Os testes e2e são executados por meio da biblioteca cypress, no front:

```
npx cypress open
```
