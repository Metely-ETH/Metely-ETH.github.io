const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");
const modal = document.getElementById("wechatModal");
const consultForm = document.querySelector("[data-consult-form]");
const formStatus = document.querySelector("[data-form-status]");

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  menuButton.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
  menuButton.innerHTML = `<span aria-hidden="true">${isOpen ? "×" : "☰"}</span>`;
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove("is-open");
    menuButton?.setAttribute("aria-label", "打开导航");
    if (menuButton) menuButton.innerHTML = '<span aria-hidden="true">☰</span>';
  }
});

document.querySelectorAll("[data-wechat]").forEach((button) => {
  button.addEventListener("click", openWechat);
});

document.querySelector("[data-close-wechat]")?.addEventListener("click", closeWechat);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeWechat();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) {
    closeWechat();
  }
});

document.querySelector("[data-copy-wechat]")?.addEventListener("click", async (event) => {
  const value = document.getElementById("wechatId")?.textContent?.trim() || "";
  const button = event.currentTarget;

  try {
    await navigator.clipboard.writeText(value);
    button.textContent = "已复制";
  } catch {
    button.textContent = "手动复制";
  }

  window.setTimeout(() => {
    button.textContent = "复制";
  }, 1600);
});

consultForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(consultForm);
  const brief = buildBrief(data);

  try {
    await navigator.clipboard?.writeText(brief);
    setStatus("合作简报已复制，扫码后可以直接粘贴发送。");
  } catch {
    setStatus("合作简报已生成，扫码后可以直接发送给我。");
  }

  consultForm.reset();
  openWechat();
});

function openWechat() {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeWechat() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function readField(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : "未填写";
}

function buildBrief(formData) {
  return [
    "合作咨询",
    "",
    `咨询方向：${readField(formData, "intent")}`,
    `行业 / 品牌：${readField(formData, "bizName")}`,
    `微信号：${readField(formData, "wechat")}`,
    "",
    "想解决的问题：",
    readField(formData, "need"),
  ].join("\n");
}

function setStatus(message) {
  if (formStatus) formStatus.textContent = message;
}
