countryid = [
  "sg",
  "my",
  "ph",
  "la",
  "th",
  "hk",
  "mo",
  "np",
  "kr",
  "uz",
  "az",
  "ge",
  "am",
  "md",
  "au",
  "nz",
  "br",
  "kz",
  "sa",
  "br",
  "kz",
  "sa",
  "ae",
  "lb",
  "qa",
  "bh",
];

const countryKeys = {
  q: "sg", //singapore
  w: "my", //malaysia
  e: "ph", //philippines
  r: "la", //laos
  t: "th", //thailand
  y: "hk", //hongkong
  u: "mo", //macau
  i: "np", //nepal
  o: "kr", //south korea
  p: "uz", //uzbekistan
  a: "az", //azerbaijan
  s: "ge", //georgia
  d: "am", //armenia
  f: "md", //moldova
  g: "au", //australia
  h: "nz", //new zealand
  j: "br", //brazil
  k: "kz", //kazakhstan
  l: "sa", //saudi arabia
  z: "ae", //united arab emirates
  x: "lb", //lebanon
  c: "qa", //qatar
  v: "bh", //bahrain
};
// 为了确保所有的 <path> 元素都已经加载，我们需要等待 DOMContentLoaded 事件触发
document.addEventListener("DOMContentLoaded", () => {
  // 获取所有 <path> 元素
  const svgObject = document.getElementById("svg-map");
  const svgElement = document.getElementById("svgElement");
  svgObject.addEventListener("load", () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll("path");
    paths.forEach((path) => {
      if (!path.classList.contains("oceanxx") && !countryid.includes(path.id)) {
        path.style.fill = "#ffdead";
      }
      if (countryid.includes(path.id)) {
        path.style.fill = "#c0c0c0";
        path.addEventListener("click", (event) => {
          path.style.fill = "#ffdead";
        });

        let titleElement = path.querySelector("title");
        if (titleElement) {
          const bbox = path.getBBox();
          createTextElement(svgElement, bbox, titleElement.textContent);
        }
      }
    });

    //获取所有<g>标签元素
    const gs = svgDoc.querySelectorAll("g");
    //遍历gs,如果id在countryid中，并且有path子元素,则将其下的所有path变色
    gs.forEach((g) => {
      if (countryid.includes(g.id)) {
        let paths = g.querySelectorAll("path");
        paths.forEach((path) => {
          path.style.fill = "#c0c0c0";
          path.addEventListener("click", (event) => {
            paths.forEach((path2) => {
              path2.style.fill = "#ffdead";
            });
          });
        });

        let titleElement = g.querySelector("title");
        if (titleElement) {
          const bbox = g.getBBox();
          createTextElement(svgElement, bbox, titleElement.textContent);
        }
      }
    });
  });
});

function createTextElement(svgElement, bbox, text) {
  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  textElement.setAttribute("x", bbox.x + bbox.width / 2);
  textElement.setAttribute("y", bbox.y + bbox.height / 2);
  textElement.setAttribute("fill", "black");
  textElement.setAttribute("font-size", "20px");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("dominant-baseline", "middle");
  textElement.setAttribute("z-index", "5");
  textElement.textContent = text;
  textElement.style.cursor = "move"; // 设置鼠标样式为移动手势

  let shiftX, shiftY;
  
  function moveAt(pageX, pageY) {
    textElement.setAttribute("x", pageX - shiftX);
    textElement.setAttribute("y", pageY - shiftY);
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  function onMouseUp() {
    // 解绑移动事件
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  textElement.addEventListener("mousedown", function (event) {
    event.preventDefault();

    shiftX = event.clientX - textElement.getBoundingClientRect().left;
    shiftY = event.clientY - textElement.getBoundingClientRect().top;

    // 绑定移动和释放事件
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // 防止默认拖拽行为（例如在某些浏览器中可能触发的拖动效果）
  textElement.addEventListener("dragstart", function () {
    return false;
  });

  svgElement.appendChild(textElement);
}

//添加键盘监听事件
document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase(); // 获取按下的键并转换为小写
  const countryId = countryKeys[key]; // 查找对应的国家ID
  console.log(countryId); // 打印国家ID
  if (countryId) {
    highlightCountry(countryId); // 高亮显示国家
  }
});

//高亮显示国家
function highlightCountry(countryId) {
  const svgObject = document.getElementById("svg-map");
  const svgDoc = svgObject.contentDocument;
  const element = svgDoc.getElementById(countryId);
  console.log(element);
  //如果g是<g>标签
  if (element.tagName.toLowerCase() === "g") {
    let paths = element.querySelectorAll("path");
    paths.forEach((path) => {
        path.style.fill = "#ffdead";
    });
} else if (element.tagName.toLowerCase() === "path") {
    element.style.fill = "#ffdead";
}
}
