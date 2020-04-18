---
layout: layouts/base
title: Terminal Commands
---

# Terminal Commands

<ul>
{%- for termcmd in collections.sortedTerminalCommands -%}
  <li><a href="{{ termcmd.url }}">{{ termcmd.data.title }}</a></li>
{%- endfor -%}
</ul>
