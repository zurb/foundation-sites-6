---
title: Drilldown
js: js/foundation.drilldown.js
---

## Basics

Drilldowns use the standard [menu bar](menu-bar.html) syntax. Add the attribute `data-drilldown` to the root `<ul>`, and `data-submenu` to each nested menu.

```html
<ul class="vertical menu-bar" data-drilldown>
  <li>
    <a href="#">Item 1</a>
    <ul class="vertical menu-bar" data-submenu>
      <!-- ... -->
    </ul>
  </li>
  <li><a href="#">Item 2</a></li>
  <li><a href="#">Item 3</a></li>
</ul>
```

<ul class="vertical menu-bar" data-drilldown style="width: 300px;" id="m1">
  <li>
    <a href="#">Item 1</a>
    <ul class="vertical menu-bar" data-submenu id="m2">
      <li>
        <a href="#">Item 1A</a>
        <ul class="vertical menu-bar" data-submenu id="m3">
          <li><a href="#">Item 1A</a></li>
          <li><a href="#">Item 1B</a></li>
          <li><a href="#">Item 1C</a></li>
          <li><a href="#">Item 1D</a></li>
          <li><a href="#">Item 1E</a></li>
        </ul>
      </li>
      <li><a href="#">Item 1B</a></li>
      <li><a href="#">Item 1C</a></li>
      <li><a href="#">Item 1D</a></li>
      <li><a href="#">Item 1E</a></li>
    </ul>
  </li>
  <li>
    <a href="#">Item 2</a>
    <ul class="vertical menu-bar" data-submenu>
      <li><a href="#">Item 2A</a></li>
      <li><a href="#">Item 2B</a></li>
      <li><a href="#">Item 2C</a></li>
      <li><a href="#">Item 2D</a></li>
      <li><a href="#">Item 2E</a></li>
    </ul>
  </li>
  <li>
    <a href="#">Item 3</a>
    <ul class="vertical menu-bar" data-submenu>
      <li><a href="#">Item 3A</a></li>
      <li><a href="#">Item 3B</a></li>
      <li><a href="#">Item 3C</a></li>
      <li><a href="#">Item 3D</a></li>
      <li><a href="#">Item 3E</a></li>
    </ul>
  </li>
</ul>