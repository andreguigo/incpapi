![Vollunteer](https://raw.githubusercontent.com/andreguigo/incp/refs/heads/main/public/volunteer.png)

# Volunteer Api

O código deste respositório é uma web api desenvolvida para o registro de voluntários em diversas áreas de atividades da INCP.

**INCP** é a sigla para Igreja do Nazareno Central de Paulista - PE.

## Construção

### Pré requisitos
* Node
* Cloudinary
* MongoDB

###### Outros pacotes na aplicação
* Express
* Formidable
* Mongoose
* Uuid V4

### Banco de dados e migrations

Os dados são não relacionais e aqui aramazenados em MongoDB Cloud utilizando o pacote `Mongoose`.

### Git e/ou Versionamento
`main` - branch de versão publicada.

_Aqui não há necessidade de uma branch para homologação ou outras situações por se tratar de uma aplicação de laboratório_.

#### Contribuições são bem-vindas! 
Se quiser adicionar novas funcionalidades, corrigir bugs ou melhorar a documentação:

1. Fork este repositório
2. Crie uma nova branch
```bash
    git checkout -b feature/nova-funcionalidade
```
3. Faça suas alterações e commit
4. Abra um Pull Request

## Execução

Certifique-se que você está na raíz do projeto `volunteer` e execute o comando abaixo para instalar as dependências:

```bash
    npm install
```
logo após, execute o projeto:

```bash
    node server.js
```

## Atualizações

__Vs 1.0.0__
* Versão inicial do projeto
