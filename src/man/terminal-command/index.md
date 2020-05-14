---
layout: base
title: Terminal Commands
topLevelMenu: Man
---

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item"><a href="/man/">Man</a></li>
    <li class="breadcrumb-item active" aria-current="page">{{ title }}</li>
  </ol>
</nav>

<ul>
{%- for termcmd in collections.sortedTerminalCommands -%}
  <li><a href="{{ termcmd.url }}">{{ termcmd.data.title }}</a></li>
{%- endfor -%}
</ul>
