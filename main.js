const solutions = {
  growth: {
    kicker: "Growth System",
    title: "从一个获客问题，拆成内容、工具和成交动作",
    text: "适合家居、餐饮、美业、教育、本地生活服务。先找到真实转化瓶颈，再用 AI 做内容脚本、客户问答、渠道素材和线索筛选。",
    a: "32%",
    b: "7天",
    c: "1套",
  },
  content: {
    kicker: "Content Engine",
    title: "把短视频、直播和图文内容变成可复用生产线",
    text: "从门店话术、产品卖点、用户评价和老板经验里提炼内容资产，再做成脚本、分镜、素材清单和发布节奏。",
    a: "50+",
    b: "3类",
    c: "SOP",
  },
  order: {
    kicker: "Order Loop",
    title: "把浏览、预约、支付、客服和后台交接连成闭环",
    text: "适合体验课、门店预约、服务报名、活动收单。先用轻量 H5 验证，再决定是否升级小程序或管理后台。",
    a: "1条",
    b: "24h",
    c: "CSV",
  },
  process: {
    kicker: "Process AI",
    title: "把混乱流程拆成角色、字段、规则和看板",
    text: "企业内部要先知道谁负责、记录什么数据、哪里验收、哪些风险必须拦截，AI 才能真正提效。",
    a: "6段",
    b: "RACI",
    c: "看板",
  },
  training: {
    kicker: "Training Camp",
    title: "让团队带着真实任务学习，而不是只听工具演示",
    text: "体验课、训练营和企业内训都围绕业务场景展开：现场拆需求、现场做工具、现场沉淀可复用模板。",
    a: "2h",
    b: "1题",
    c: "共创",
  },
};

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

document.querySelectorAll(".solution-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".solution-tab").forEach((item) => item.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    const key = tab.getAttribute("data-solution");
    const item = solutions[key];
    if (!item) return;

    setText("solutionKicker", item.kicker);
    setText("solutionTitle", item.title);
    setText("solutionText", item.text);
    setText("solutionStatA", item.a);
    setText("solutionStatB", item.b);
    setText("solutionStatC", item.c);
  });
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

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

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
