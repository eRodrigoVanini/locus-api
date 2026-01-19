# ERS - Especificação de Requisitos de Software

**Projeto:** Locus API (Calculadora de Estudos de Viabilidade Urbanística)  
**Versão:** 1.0  
**Autor:** Rodrigo Vanini  
**Cidade – UF:** Salto – SP  
**Data:** Janeiro/2026

---

## CAPÍTULO 1 – Introdução

### 1.1 Objetivo

Este documento tem por objetivo demonstrar todas as características do software Locus, especificando os requisitos funcionais e não-funcionais necessários para o desenvolvimento do sistema.

### 1.2 Escopo

O produto a ser desenvolvido denomina-se **Locus**. Trata-se de um sistema web voltado para o ramo de **Arquitetura e Urbanismo/Setor Imobiliário/Setor Educativo**, cujo principal objetivo é automatizar o cálculo de índices urbanísticos (Coeficiente de Aproveitamento, Taxa de Ocupação, dentre outros), permitindo a análise instantânea de viabilidade construtiva de lotes urbanos.

O software fará a gestão centralizada das regras de zoneamento municipais (Plano Diretor), permitindo o cadastro de Cidades, Zonas e Tipos de Uso. O sistema cruzará os dados informados pelo usuário (área do terreno e localização) com as regras cadastradas no banco de dados para gerar automaticamente o potencial construtivo.

**O software não fará** a análise de projetos arquitetônicos desenhados (CAD/BIM), limitando-se aos cálculos matemáticos dos índices legais.

A aplicação será especificada como uma plataforma **SaaS (Software as a Service)**, acessível via navegador. Os benefícios relevantes incluem:

- Redução drástica no tempo de consulta à legislação (de horas para segundos)
- Eliminação de erros humanos nos cálculos matemáticos
- Centralização das informações do Plano Diretor
- Agilidade para arquitetos e investidores na tomada de decisão sobre a compra de terrenos

### 1.3 Definições, Siglas e Abreviações

| Sigla | Definição                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------ |
| ERS   | Especificação de Requisitos de Software                                                          |
| CA    | Coeficiente de Aproveitamento (Índice que define quantos m² podem ser construídos)               |
| TO    | Taxa de Ocupação (Percentual do terreno que pode ser ocupado pela projeção da edificação)        |
| API   | Application Programming Interface (Interface de comunicação entre o Frontend e o Banco de Dados) |

### 1.4 Referências

| Nº  | Título                              | Data Aquisição | Responsável pelo Fornecimento                |
| --- | ----------------------------------- | -------------- | -------------------------------------------- |
| 01  | Plano Diretor do Município de Salto | 20/01/2025     | Prefeitura Municipal de Salto (Site Oficial) |
| 02  | Lei de Zoneamento e Uso do Solo     | 20/01/2025     | Prefeitura Municipal de Salto                |

### 1.5 Informações Adicionais

#### 1.5.1 Legislação de Software

O software seguirá as normas de desenvolvimento de sistemas vigentes, respeitando a legislação de proteção de dados (LGPD) e direitos autorais.

### 1.6 Visão Geral

Este documento está organizado em capítulos que detalham a descrição geral do produto, requisitos específicos, modelo de dados e especificações técnicas necessárias para o desenvolvimento do sistema.

---

## CAPÍTULO 2 – Descrição Geral do Produto

### 2.1 Estudo de Viabilidade

A alternativa selecionada para a informatização foi o desenvolvimento de uma **Aplicação Web (Web App)**, utilizando arquitetura Cliente-Servidor (API REST em Node.js e Frontend em HTML/JS).

#### Viabilidade Técnica

A tecnologia escolhida (JavaScript/Node.js) é de código aberto, amplamente documentada e não exige hardware potente do cliente, apenas um navegador com internet.

### FUNÇÕES DO PRODUTO

| Referência | Função                  | Visibilidade      | Atributo                | Detalhe                                    | Categoria   |
| ---------- | ----------------------- | ----------------- | ----------------------- | ------------------------------------------ | ----------- |
| RF_B1      | Manter Usuários         | Restrito (Admin)  | Nome, Email, Senha      | Cadastro de acesso                         | Básica      |
| RF_B2      | Manter Cidades          | Restrito (Admin)  | Nome, Estado            | Cadastro geográfico                        | Básica      |
| RF_B3      | Manter Zonas            | Restrito (Admin)  | Sigla, Nome, Cidade     | Vinculada à cidade                         | Básica      |
| RF_B4      | Manter Tipos de Uso     | Restrito (Admin)  | Descrição do Uso        | Ex: Residencial, Comercial                 | Básica      |
| RF_B5      | Manter Regras de Uso    | Restrito (Admin)  | CA, TO, Zona, Uso       | Vincula índices à zona                     | Básica      |
| RF_F1      | Cadastrar Lote          | Público (Cliente) | Área, Zona, Uso         | Entrada de dados para cálculo              | Fundamental |
| RF_S1      | Calcular Viabilidade    | Público (Cliente) | Área Construída, Térreo | Processamento matemático (Lote \* Índices) | Saída       |
| RF_S2      | Listar Zonas por Cidade | Público (Cliente) | Lista de Zonas          | Filtro dinâmico (Cascata)                  | Saída       |
| RF_S3      | Listar Usos Permitidos  | Público (Cliente) | Lista de Usos           | Filtra usos com base na Zona               | Saída       |

### 2.3 Características do Usuário

Os usuários do sistema possuem nível superior (Arquitetos, Engenheiros, Investidores) e conhecimento intermediário em informática, sendo capazes de navegar em interfaces web e compreender conceitos urbanísticos básicos.

### 2.4 Limites, Suposições e Dependências

**Limites:**

- O sistema não realizará análise de projetos arquitetônicos completos (plantas, cortes, fachadas)
- Limitado aos cálculos de CA e TO conforme legislação municipal

**Suposições:**

- O sistema depende de conexão contínua com a internet
- Assume-se que os dados cadastrados (índices do plano diretor) foram inseridos corretamente pelo administrador conforme a lei vigente

**Dependências:**

- Disponibilidade de servidor web
- Acesso ao banco de dados PostgreSQL
- Navegador compatível com HTML5 e JavaScript

### 2.5 Requisitos Adiados

Funcionalidades planejadas para versões futuras:

- Geração de relatório em PDF para impressão
- Cálculo de recuos frontais e laterais (será implementado na versão 2.0)
- Integração com mapas (Google Maps)

---

## CAPÍTULO 3 – Requisitos Específicos

### 3.1 Atores do Sistema

- **Administrador:** Responsável por cadastrar a "Inteligência" do sistema (Cidades, Zonas, Tipos de Uso e os Índices Urbanísticos)
- **Usuário Final (Arquiteto/Investidor):** Responsável por cadastrar os dados do Lote e solicitar o cálculo de viabilidade

### 3.2 Requisitos Funcionais (RF)

#### Módulo 1: Cadastros Base (Backoffice)

**[RF001] Manter Usuários**  
O sistema deve permitir criar, listar, editar e remover usuários (Nome, Email, Senha, Idade).

**[RF002] Manter Cidades**  
O sistema deve permitir criar, editar e remover Municípios (Nome, UF).

**[RF003] Manter Zonas**  
O sistema deve permitir criar, editar e remover Zonas Urbanas (ex: ZRU, ZC, ZI) vinculadas obrigatoriamente a uma Cidade.

**[RF004] Manter Tipos de Uso**  
O sistema deve permitir criar, listar, editar e remover naturezas de uso do solo (ex: Residencial Unifamiliar, Comercial, Industrial).

#### Módulo 2: Regras de Negócio (Core)

**[RF005] Definir Regras de Zoneamento**  
O sistema deve permitir vincular uma Zona a um Tipo de Uso atribuindo índices específicos:

- Coeficiente de Aproveitamento (CA)
- Taxa de Ocupação (TO)
- Recuos (Frontal, Lateral, Fundos) - Expansão futura
- Gabarito de Altura - Expansão futura

#### Módulo 3: Simulação e Frontend

**[RF006] Filtragem em Cascata (Localização)**  
Na interface de cadastro, ao selecionar uma Cidade, o sistema deve carregar apenas as Zonas pertencentes àquela cidade.

**[RF007] Filtragem em Cascata (Usos Permitidos)**  
Ao selecionar uma Zona, o sistema deve disponibilizar apenas os Tipos de Uso permitidos (que possuem regras cadastradas) para aquela zona, bloqueando ou ocultando os demais.

**[RF008] Cadastro de Lote (Simulação)**  
O usuário deve poder informar:

- Área Total do Terreno (m²)
- Cidade e Zona
- Uso Pretendido
- Se pertence a Condomínio Fechado

**[RF009] Calcular Viabilidade**  
O sistema deve processar os dados do lote cruzando com as Regras de Zoneamento (RF005) e retornar:

- Área Máxima Computável (Área Construída)
- Área Máxima de Ocupação no Térreo (Projeção)

### 3.3 Regras de Negócio (RN)

**[RN001] Cálculo de Potencial Construtivo**

```
Área Máxima Construída = Área do Lote × Coeficiente de Aproveitamento (CA)
```

**[RN002] Cálculo de Ocupação de Solo**

```
Área Máxima Térreo = Área do Lote × Taxa de Ocupação (TO)
```

_Nota: Se a TO for percentual (ex: 60), deve-se dividir por 100._

**[RN003] Integridade de Zona**  
Uma Zona não pode existir sem estar vinculada a uma Cidade.

**[RN004] Restrição de Uso**  
Um usuário não pode calcular viabilidade para um Tipo de Uso que não esteja explicitamente cadastrado na tabela de regras daquela Zona (Uso Proibido).

**[RN005] Validação de Dados**  
O nome do usuário deve ter entre 3 e 255 caracteres. Email deve ser único.

### 3.4 Requisitos Não-Funcionais (RNF)

**[RNF001] Arquitetura**  
O sistema deve seguir a arquitetura MVC (Model-View-Controller) ou API RESTful separada do Frontend.

**[RNF002] Banco de Dados**  
Deve utilizar banco de dados Relacional (PostgreSQL) gerido via ORM (Sequelize).

**[RNF003] Interface**  
O Frontend deve ser responsivo (HTML5/CSS3) e utilizar JavaScript Puro (Vanilla) para manipulação do DOM.

**[RNF004] Desempenho**  
O carregamento das listas de Zonas e Usos deve ocorrer de forma assíncrona (AJAX/Fetch) sem recarregar a página.

---

## CAPÍTULO 4 – Modelo de Dados

### 4.1 Diagrama de Entidade-Relacionamento (DER) Simplificado

**Relacionamentos principais:**

- **Cities** (1) ──── (N) **Zones** (Uma cidade tem várias zonas)
- **Zones** (1) ──── (N) **ZoneUseRules** (Uma zona tem várias regras)
- **UseTypes** (1) ──── (N) **ZoneUseRules** (Um tipo de uso aparece em várias regras)
- **Lots** (N) ──── (1) **Zones** (Um lote pertence a uma zona)

### 4.2 Estrutura das Tabelas

Consulte o arquivo `schema-docs.md` para detalhamento completo de todas as tabelas, campos, tipos de dados e relacionamentos.

---

## CAPÍTULO 5 – Casos de Uso

### 5.1 Diagrama de Casos de Uso

```
[Administrador]
    |
    |--- (Manter Usuários)
    |--- (Manter Cidades)
    |--- (Manter Zonas)
    |--- (Manter Tipos de Uso)
    |--- (Definir Regras de Zoneamento)

[Usuário Final]
    |
    |--- (Cadastrar Lote)
    |--- (Calcular Viabilidade)
    |--- (Consultar Zonas)
    |--- (Consultar Usos Permitidos)
```

---

## Anexos

### Glossário Técnico

- **Coeficiente de Aproveitamento (CA):** Número que multiplicado pela área do lote define a área total construída permitida
- **Taxa de Ocupação (TO):** Percentual da área do lote que pode ser ocupada pela projeção da edificação no térreo
- **Zoneamento:** Divisão territorial do município em zonas com características e regras específicas
- **Plano Diretor:** Lei municipal que estabelece diretrizes para o desenvolvimento urbano

---

**Documento elaborado em:** Maio/2025  
**Última atualização:** Maio/2025  
**Status:** Em desenvolvimento
