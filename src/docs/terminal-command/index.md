---
layout: layouts/base
title: Terminal Commands
---

<h1><a href="/docs/">Docs</a> / Terminal Commands</h1>

<ul>
{%- for termcmd in collections.sortedTerminalCommands -%}
  <li><a href="{{ termcmd.url }}">{{ termcmd.data.title }}</a></li>
{%- endfor -%}
</ul>
