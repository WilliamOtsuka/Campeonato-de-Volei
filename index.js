import express from 'express'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import vercel from '@vercel/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: "M1nh4Ch4v3S3Cr3t4",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, // 30 minutos
    httpOnly: true,
    secure: true
  }
}))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Page</title>
          <link rel="stylesheet" href="/css/style.css">
        </head>

        <body class="login-body">
          <form class="login-form" action="/login" method="POST">
              <h1 class="login-title">Login</h1>
              <label class="login-label" for="username">Usuário:</label>
              <input class="login-input" type="text" id="username" name="username" required>
              <label class="login-label" for="password">Senha:</label>
              <input class="login-input" type="password" id="password" name="password" required>
              <button class="login-btn" type="submit">Entrar</button>
          </form>
        </body>
      </html>
`
  )
  res.end()
})


function verificarAutenticacao(req, res, next) {
  if (req.session.logado) {
    console.log('Usuário autenticado')
    next()
  } else {
    res.redirect('/')
  }
}

app.get('/home', verificarAutenticacao, (req, res) => {
  const ultimoLogin = req.cookies.ultimoLogin
  res.send(`
    <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Homepage</title>
          <link rel="stylesheet" href="css/style.css">
      </head>

      <body class="body-home">
          <nav class="nav-home">
              <ul class="nav-list-home">
                  <li class="item-nav"><a class="link-nav" href="home">Menu</a></li>
                  <li class="item-nav"><a class="link-nav" href="cadastro_equipes">Cadastro de equipes (times)</a></li>
                  <li class="item-nav"><a class="link-nav" href="cadastro_jogadores">Cadastro de jogadores</a></li>
                  <li class="item-nav"><a class="link-nav" href="/logout">Logout</a></li>
              </ul>
          </nav>
          <main class="main-home">
              <h1 class="title-home">Bem-vindo ao menu inicial!</h1>
              <p class="text-home"><strong>${ultimoLogin ? "Ultimo acesso: " + ultimoLogin : ""}</strong></p>
              <p class="text-home">Selecione uma das opções acima para continuar.</p>
          </main>
      </body>
      </html>
    `)
})

app.get('/cadastro_equipes', verificarAutenticacao, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Equipes</title>
        <link rel="stylesheet" href="css/style.css">
    </head>

    <body class="body-home">
        <nav class="nav-home">
            <ul class="nav-list-home">
                <li class="item-nav"><a class="link-nav" href="home">Menu</a></li>
                <li class="item-nav"><a class="link-nav" href="cadastro_equipes">Cadastro de equipes (times)</a></li>
                <li class="item-nav"><a class="link-nav" href="cadastro_jogadores">Cadastro de jogadores</a></li>
                <li class="item-nav"><a class="link-nav" href="/logout">Logout</a></li>
            </ul>
        </nav>

        <main class="main-home">
            <h1 class="title-home">Cadastro de Equipes</h1>
            <form class="form-cadastro" action="/cadastro_equipes" method="POST">
                <label class="label-cadastro" for="nomeTime">Nome da Equipe:</label>
                <input class="input-cadastro" type="text" id="nomeTime" name="nomeTime" required>

                <label class="label-cadastro" for="nomeCoach">Nome do Técnico Responsável:</label>
                <input class="input-cadastro" type="text" id="nomeCoach" name="nomeCoach" required>

                <label class="label-cadastro" for="telefoneCoach">Telefone do Técnico:</label>
                <input class="input-cadastro" type="tel" id="telefoneCoach" name="telefoneCoach"
                placeholder="(99) 99999-9999" required>

                <button class="btn-cadastro" type="submit">Cadastrar Equipe</button>
            </form>
            <p class="text-home">Após o cadastro, você poderá adicionar jogadores a esta equipe.</p>
        </main>
    </body>
    <script src="js/javascript.js"></script>
    </html>
  `)
})

app.get('/cadastro_jogadores', verificarAutenticacao, (req, res) => {
  const optionsEquipes = equipes.length
    ? equipes.map(eq => `<option value="${eq.nomeTime}">${eq.nomeTime}</option>`).join('')
    : '<option value="">Nenhuma equipe cadastrada</option>';

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Jogadores</title>
        <link rel="stylesheet" href="css/style.css">
    </head>

    <body class="body-home">
        <nav class="nav-home">
            <ul class="nav-list-home">
                <li class="item-nav"><a class="link-nav" href="home">Menu</a></li>
                <li class="item-nav"><a class="link-nav" href="cadastro_equipes">Cadastro de equipes (times)</a></li>
                <li class="item-nav"><a class="link-nav" href="cadastro_jogadores">Cadastro de jogadores</a></li>
                <li class="item-nav"><a class="link-nav" href="/logout">Logout</a></li>
            </ul>
        </nav>

        <main class="main-home">
            <h1 class="title-home">Cadastro de Jogadores</h1>
            <form class="form-cadastro" action="/cadastro_jogadores" method="POST">
                <label class="label-cadastro" for="nomeJogador">Nome do Jogador:</label>
                <input class="input-cadastro" type="text" id="nomeJogador" name="nomeJogador" required>

                <label class="label-cadastro" for="numeroJogador">Nº da Camisa:</label>
                <input class="input-cadastro" type="number" id="numeroJogador" name="numeroJogador" min="1" required>

                <label class="label-cadastro" for="aniversarioJogador">Data de Nascimento:</label>
                <input class="input-cadastro" type="date" id="aniversarioJogador" name="aniversarioJogador" required>

                <label class="label-cadastro" for="alturaJogador">Altura (cm):</label>
                <input class="input-cadastro" type="number" id="alturaJogador" name="alturaJogador" min="1" required>

                <label class="label-cadastro" for="generoJogador">Gênero:</label>
                <select class="input-cadastro" id="generoJogador" name="generoJogador" required>
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>

                <label class="label-cadastro" for="posicaoJogador">Posição:</label>
                <input class="input-cadastro" type="text" id="posicaoJogador" name="posicaoJogador" required>
                
                <label class="label-cadastro" for="time">Equipe:</label>
                <select class="input-cadastro" id="time" name="time" required>
                  ${optionsEquipes}
                </select>

                <button class="btn-cadastro" type="submit">Cadastrar Jogador</button>
            </form>
            <p class="text-home">Preencha os dados do jogador para cadastrá-lo em uma equipe.</p>
            <h2 class="titulo-equipes" style="margin-top:30px;">Equipes Cadastradas</h2>
            <ul class="lista-equipes">
                ${equipes.length
      ? equipes.map(eq =>
        `<li class="item-equipe"><strong class="nome-equipe">${eq.nomeTime}</strong><span class="treinador-equipe"> Treinador: ${eq.nomeCoach}</span> <span class="telefone-treinador">Telefone: ${eq.telefoneCoach}</span></li>`
      ).join('')
      : '<li class="item-equipe">Nenhuma equipe cadastrada.</li>'
    }
            </ul>
        </main>

    </body>

    <script src="js/javascript.js"></script>

    </html>
  `)
})

app.post('/login', (req, res) => {
  let { username, password } = req.body
  if (username === 'admin' && password === '123') {
    req.session.logado = true
    res.cookie('ultimoLogin', new Date().toLocaleString(), { maxAge: 30 * 60 * 1000 })
    res.redirect('/home')
  }
  else {
    res.status(401).send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Page</title>
      <link rel="stylesheet" href="/css/style.css">
      </head>
      <body class="login-body">
      <form class="login-form" action="/login" method="POST">
      <h1 class="login-title">Login</h1>
      <label class="login-label" for="username">Usuário:</label>
      <input class="login-input" type="text" id="username" name="username" required>
      <label class="login-label" for="password">Senha:</label>
      <input class="login-input" type="password" id="password" name="password" required>
      <div style="color: red; margin: 10px 0 10px 0; text-align: center;">Usuário ou senha inválido</div>
      <button class="login-btn" type="submit">Entrar</button>
      </form>
      </body>
      </html>
    `)
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  console.log('Usuário deslogado')
  res.redirect('/')
})

const equipes = []

app.post('/cadastro_equipes', verificarAutenticacao, (req, res) => {
  let { nomeTime, nomeCoach, telefoneCoach } = req.body

  if (!nomeTime || !nomeCoach || !telefoneCoach) {
    return res.status(400).send('Todos os campos são obrigatórios.')
  }

  if (equipes.some(eq => eq.nomeTime === nomeTime)) {
    return res.status(400).send('Já existe uma equipe com esse nome.');
  }

  equipes.push({ nomeTime, nomeCoach, telefoneCoach })

  let listaEquipes = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Equipes Cadastradas</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body class="body-home">
            <h2 class="titulo-equipes">Equipes Cadastradas</h2>
            <ul class="lista-equipes">
                ${equipes
      .map(
        eq =>
          `<li class="item-equipe"><strong class="nome-equipe">${eq.nomeTime}</strong><span class="treinador-equipe">Treinador: ${eq.nomeCoach}</span> <span class="telefone-treinador">Telefone: ${eq.telefoneCoach}</span></li>`
      )
      .join('')}
            </ul>
            <div class="links-equipes">
                <a class="link-voltar-cadastro" href="/cadastro_equipes">Voltar para cadastro</a> | 
                <a class="link-menu-sistema" href="/home">Menu do sistema</a>
            </div>
        </body>
        </html>
        `

  res.send(listaEquipes)
})

const jogadores = []

app.post('/cadastro_jogadores', verificarAutenticacao, (req, res) => {
  let {
    nomeJogador,
    numeroJogador,
    aniversarioJogador,
    alturaJogador,
    generoJogador,
    posicaoJogador,
    time
  } = req.body

  if (
    !nomeJogador ||
    !numeroJogador ||
    !aniversarioJogador ||
    !alturaJogador ||
    !generoJogador ||
    !posicaoJogador ||
    !time
  ) {
    return res.status(400).send(`Todos os campos são obrigatórios. ${nomeJogador}, ${numeroJogador}, ${aniversarioJogador}, ${alturaJogador}, ${generoJogador}, ${posicaoJogador}, ${time}`)
  }

  const jogadoresDoTime = jogadores.filter(j => j.time === time)
  if (jogadoresDoTime.length >= 6) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Limite de Jogadores</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body class="body-home">
        <h2 class="titulo-equipes">Limite de Jogadores Atingido</h2>
        <p class="text-home" style="color:red;">Não é possível cadastrar mais de 6 jogadores para a equipe <strong>${time}</strong>.</p>
        <div class="links-equipes">
          <a class="link-voltar-cadastro" href="/cadastro_jogadores">Voltar para cadastro</a> | 
          <a class="link-menu-sistema" href="/home">Menu do sistema</a>
        </div>
      </body>
      </html>
    `)
  }

  if (isNaN(numeroJogador) || parseInt(numeroJogador) < 1) {
    return res.status(400).send('O número da camisa deve ser um número inteiro positivo.');
  }

  if (isNaN(alturaJogador) || parseInt(alturaJogador) < 1) {
    return res.status(400).send('A altura deve ser um número positivo.');
  }

  if (new Date(aniversarioJogador) > new Date()) {
    return res.status(400).send('A data de nascimento não pode ser no futuro.');
  }

  let generosValidos = ['Masculino', 'Feminino', 'Outro'];
  if (!generosValidos.includes(generoJogador)) {
    return res.status(400).send('Gênero inválido.');
  }

  jogadores.push({
    nomeJogador,
    numeroJogador,
    aniversarioJogador,
    alturaJogador,
    generoJogador,
    posicaoJogador,
    time
  })

  const equipesComJogadores = equipes.map(eq => {
    return {
      ...eq,
      jogadores: jogadores.filter(j => j.time === eq.nomeTime)
    }
  })

  let listaJogadores = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Jogadores Cadastrados</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body class="body-home">
      <h2 class="titulo-equipes">Jogadores Cadastrados por Equipe</h2>
      <ul class="lista-equipes">
        ${equipesComJogadores.length
      ? equipesComJogadores.map(eq => `
              <li class="item-equipe">
                <strong class="nome-equipe">${eq.nomeTime}</strong>
                <span class="treinador-equipe">Treinador: ${eq.nomeCoach}</span>
                <span class="telefone-treinador">Telefone: ${eq.telefoneCoach}</span>
                <ul class="lista-jogadores">
                  ${eq.jogadores.length
          ? eq.jogadores.map(j => `
                        <li class="item-jogador">
                          <strong>${j.nomeJogador}</strong> - Nº ${j.numeroJogador}, ${j.posicaoJogador}, ${j.generoJogador}, Nasc: ${formatarData(j.aniversarioJogador)}, Altura: ${j.alturaJogador}cm
                        </li>
                      `).join('')
          : '<li class="item-jogador">Nenhum jogador cadastrado nesta equipe.</li>'
        }
                </ul>
              </li>
            `).join('')
      : '<li class="item-equipe">Nenhuma equipe cadastrada.</li>'
    }
      </ul>
      <div class="links-equipes">
        <a class="link-voltar-cadastro" href="/cadastro_jogadores">Voltar para cadastro</a> | 
        <a class="link-menu-sistema" href="/home">Menu do sistema</a>
      </div>
    </body>
    </html>
  `

  res.send(listaJogadores)
})

function formatarData(data) {
  const d = new Date(data)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  return `${dia}/${mes}/${ano}`
}

app.listen(3000, function () {
  console.log('Servidor rodando em http://localhost:3000');
})
