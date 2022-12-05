# Pathfinding Visualization

**Número da Lista**: 17

**Conteúdo da Disciplina**: Grafos2 

## Alunos

|Matrícula | Aluno |
| -- | -- |
| 20/0019015 | Guilherme Puida Moreira |
| 19/0118288 | Vitor Eduardo Kühl Rodrigues |

## Sobre 

O projeto tem como objetivo mostrar o funcionamento de algoritmos de pathfinding em uma matriz de células.
Para isso, os algoritmos são executados passo-a-passo, mostrando os caminhos visitados e as células
que serão visitadas nas próximas iterações.

Foram implementados os seguintes algoritmos de pathfinding:

- DFS
- BFS
- A* com heurística de distância Euclideana
- A* com heurística de distância de Manhattan

## Screenshots

![Alt Text](/media/image1.png)
![Alt Text](/media/image2.png)
![Alt Text](/media/image3.png)
![Alt Text](/media/image4.png)
![Alt Text](/media/leet1.jpg)
![Alt Text](/media/leet2.jpg)
![Alt Text](/media/leet3.jpg)
![Alt Text](/media/leet4.jpg)

## Instalação 

**Linguagem**: Typescript

O projeto depende de `node` >= 16 e `yarn`.

Para rodar o projeto, clone o repositório:

```
git clone https://github.com/projeto-de-algoritmos/Grafos2_Pathfinding-Visualization.git
cd Grafos2_Pathfinding-Visualization
```

Instale as dependências e rode o servidor local:

```
yarn
yarn dev
```

O projeto estará disponível em `localhost:5173`

O projeto também está hospedado em https://pathfinder.puida.xyz

## Uso 

As instruções detalhadas de uso podem ser encontradas na página do projeto.

O programa sempre tenta encontrar um caminho do canto superior esquerdo (célula verde) até o canto inferior esquerdo (célula azul).
O caminho não pode atravessar paredes (células vermelhas), que podem ser inseridas ou removidas com o mouse.

Para iniciar uma busca, selecione o algoritmo (BFS, DFS, ...) e clique em `Encontrar caminho`.
O algoritmo executará mostrando os caminhos considerados.

Se um caminho for encontrado, a execução para e o caminho é mostrado em amarelo.
Para iniciar uma nova busca, clique em `Limpar tentativa` execute os passos de execução novamente.

Alguns exemplos de layout podem ser inseridos com os botões `Parede`, `Impossível` e `Complexo`.

Para exportar ou importar um layout, o campo de texto na seção `Salvar Layout` pode ser usado.
Para exportar, clique em `Exportar` e o layout ficará disponível no campo de texto.
Para importar, cole o layout no campo de text e clique em `Importar`.

Nos algoritmos de `A*`, o caminho atual é considerado na heurística.
Para controlar o peso do tamanho atual, use o _slider_ abaixo das descrições dos algoritmos.

## Outros 

A única dependência externa (sem considerar as dependências de desenvolvimento) é uma implementação eficiente de fila de prioridade.
