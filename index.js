const {select, input, checkbox } = require('@inquirer/prompts')
const fs = require(`fs`).promises

let mensagem = `Bem vindo ao App de metas`

let listaDeMetas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("listaDeMetas.json", "utf-8")
        listaDeMetas = JSON.parse(dados)
    } catch (error) {
        listaDeMetas = []        
    }
}

const salvarMetas = async () => {
    await fs.writeFile("listaDeMetas.json", JSON.stringify(listaDeMetas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "})

    if(meta.length == 0) {
        mensagem = "A meta não pode ser vazia."
        return
    }

    listaDeMetas.push(
        { value: meta, checked: false } 
    )
    mensagem = `Meta cadastrada com sucesso!`
}

const listarMetas = async () => {
    if(listaDeMetas.length == 0) {
        mensagem = "Nenhuma meta listada"
        return
    }

    const respostas = await checkbox({ 
        message:" Use as setas para mudar de meta, o espaço para marcar ou desmacar e o Enter para finalizar.",
        choices: [...listaDeMetas],
        instructions: false,
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada"
    }

    listaDeMetas.forEach((m) => {
        m.checked = false
    })

    respostas. forEach((resposta) => {
        const meta = listaDeMetas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Meta(s) marcadas como concluída(s)"
}

const metasRealizadas = async () => {
    const realizadas = listaDeMetas.filter((meta) => {
        return meta.checked
    })

     if(realizadas.length == 0) {
        mensagem = ("Não existem metas realizadas! 😦 ")
        return
     }

     await select({
        message: "Metas Realizadas",
        choices: [...realizadas]
     })
}

const metasAbertas = async () => {
    const abertas = listaDeMetas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = `Não existe metas aberta :)`
        return
    }

    await select({
        message: `Metas Abertas ` + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas = listaDeMetas.map((meta) => {
        return  { value: meta.value, checked: false }
    })

    if (listaDeMetas.length ==0) {
        mensagem = `Nenhum item a deletar!`
        return
    }

    const itensADeletar = await checkbox ({
        message: `Selecionar item que deseja apagar`,
        choices: [...metasDesmarcadas],
    })

    if (itensADeletar.length ==0) {
        mensagem = `Nenhum item a deletar!`
        return
    }

    itensADeletar.forEach((item) => {
        listaDeMetas = listaDeMetas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = `Meta(s) deletada(s)`
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ``){
        console.log(mensagem)
        console.log(``)
        mensagem = ``
    }
}

const start = async () => {
   await carregarMetas()

    while(true){
        mostrarMensagem()
       await salvarMetas()

        const opcao = await select ({
            message: "Menu > ",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar Meta",
                    value: "listar"

                },
                {
                   name: "Metas realizadas",
                   value: "realizadas" 
                },
                {
                   name: "Metas abertas",
                   value: "abertas" 
                },
                {
                   name: "Deletar metas",
                   value: "deletar" 
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case"cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log(`Até logo`)
                return
        }
    }
}
start ()
