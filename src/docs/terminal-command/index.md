---
layout: layouts/base
title: Terminal Commands
---

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item"><a href="/docs/">Docs</a></li>
    <li class="breadcrumb-item active" aria-current="page">Terminal Commands</li>
  </ol>
</nav>

<ul>
{%- for termcmd in collections.sortedTerminalCommands -%}
  <li><a href="{{ termcmd.url }}">{{ termcmd.data.title }}</a></li>
{%- endfor -%}
</ul>
