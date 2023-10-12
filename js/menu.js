let submenu, current_submenu;

function openSubmenu(value) {
  if (submenu && submenu.style.display === "block" && current_submenu === value) {
    submenu.style.display = "none";
    return;
  }

  if (submenu) submenu.style.display = "none";
  submenu = document.getElementById(value);
  submenu.style.display = "block";
  current_submenu = value;
}

function closeSubmenu() {
  if (submenu) submenu.style.display = "none";
  current_submenu = undefined;
}
