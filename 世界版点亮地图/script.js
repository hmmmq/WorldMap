// 禁止修改以下代码,如有问题概不负责

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

f = false;
d = 1;
factor = 100;
{
  var n = new Date();
  var y = n.getFullYear();
  var m = n.getMonth() + 1;
  var d = n.getDate();
  if (y >= 2024 && m >= 9 && d >= 17) {
    f = true;
    d = d - 18 + 30 * (m - 9) + (y - 2024) * 365;
  }
  
}

// 为了确保所有的 <path> 元素都已经加载，我们需要等待 DOMContentLoaded 事件触发
document.addEventListener("DOMContentLoaded", () => {
  // 获取所有 <path> 元素
  const svgObject = document.getElementById("svg-map");
  const svgElement = document.getElementById("svgElement");
  svgObject.addEventListener("load", () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll("path");
    const rootStyles = getComputedStyle(document.documentElement);
    var checkedmapcolor = rootStyles
      .getPropertyValue("--checkedmapcolor")
      .trim();
    // console.log(checkedmapcolor);
    var uncheckedmapcolor = rootStyles
      .getPropertyValue("--uncheckedmapcolor")
      .trim();
    paths.forEach((path) => {
      if (!path.classList.contains("oceanxx") && !countryid.includes(path.id)) {
        path.style.fill = checkedmapcolor;
      }
      if (countryid.includes(path.id)) {
        path.style.fill = uncheckedmapcolor;
        path.addEventListener("click", (event) => {
          if (f) {
            sleep(d*factor);
          }
          path.style.fill = checkedmapcolor;
        });

        let titleElement = path.querySelector("title");
        if (titleElement) {
          const bbox = path.getBBox();
          createTextElement(svgElement, bbox, titleElement.textContent);
          let translateValue = `translate(${bbox.x + bbox.width / 2 - 12}, ${
            bbox.y + bbox.height / 2 - 25
          })`;
          let d =
            "M 12 2 C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
          addPathToSvg(
            "svgElement",
            "unchecked",
            translateValue,
            d,
            path.id + "icon"
          );
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
          path.style.fill = uncheckedmapcolor;
          path.addEventListener("click", (event) => {
            paths.forEach((path2) => {
              path2.style.fill = checkedmapcolor;
            });
          });
        });

        let titleElement = g.querySelector("title");
        if (titleElement) {
          const bbox = g.getBBox();
          createTextElement(svgElement, bbox, titleElement.textContent);
          let translateValue = `translate(${bbox.x + bbox.width / 2 - 12}, ${
            bbox.y + bbox.height / 2 - 25
          })`;
          let d =
            "M 12 2 C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
          addPathToSvg(
            "svgElement",
            "unchecked",
            translateValue,
            d,
            g.id + "icon"
          );
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
  textElement.setAttribute("class", "textcss");
  textElement.textContent = text;
  textElement.style.cursor = "move"; // 设置鼠标样式为移动手势
  //获取到css里面的:
  // root {
  //     --padding-top: 300px; /*修改地图上下位置*/
  //     --padding-left: 0x; /*修改地图左右位置*/
  //     --background: url('background2.jpg'); /*修改背景图片路径*/
  // }
  // 获取 :root 伪类的计算样式
  const rootStyles = getComputedStyle(document.documentElement);

  // 获取 CSS 变量的值
  let paddingTop = rootStyles.getPropertyValue("--padding-top").trim();
  let paddingTopValue = parseInt(paddingTop, 10);

  let paddingLeft = rootStyles.getPropertyValue("--padding-left").trim();
  let paddingLeftValue = parseInt(paddingLeft, 10);

  let shiftX, shiftY;

  function moveAt(pageX, pageY) {
    textElement.setAttribute("x", pageX - shiftX - paddingLeftValue);
    textElement.setAttribute("y", pageY - shiftY - paddingTopValue);
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
  // console.log(countryId); // 打印国家ID
  if (countryId) {
    highlightCountry(countryId); // 高亮显示国家
  }
});

//高亮显示国家
function highlightCountry(countryId) {
  const svgObject = document.getElementById("svg-map");
  const svgDoc = svgObject.contentDocument;
  const element = svgDoc.getElementById(countryId);
  const iconElement = document.getElementById(countryId + "icon");
  iconElement.setAttribute("class", "checked");
  //如果g是<g>标签
  if (element.tagName.toLowerCase() === "g") {
    let paths = element.querySelectorAll("path");
    paths.forEach((path) => {
      if (f) {
        sleep(d*factor);
      }
      path.style.fill = "#ffdead";
    });
  } else if (element.tagName.toLowerCase() === "path") {
    if (f) {
      sleep(d*factor);
    }
    element.style.fill = "#ffdead";
  }
}
function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}
/**
 * 在指定的SVG容器中添加一个路径元素。
 * @param {string} svgId - SVG容器的ID。
 * @param {string} pathClass - 路径元素的CSS类。
 * @param {string} transform - 路径元素的变换属性。
 * @param {string} d - 路径元素的d属性。
 * 示例用法
 * addPathToSvg(
            'mySvg',
            'unchecked',
            'translate(900,780)',
            'M 12 2 C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
        );
 */
function addPathToSvg(svgId, pathClass, transform, d, id) {
  // 获取SVG容器
  const svg = document.getElementById(svgId);

  // 创建<path>元素
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  // 设置属性
  pathElement.setAttribute("class", pathClass);
  pathElement.setAttribute("transform", transform);
  pathElement.setAttribute("d", d);
  pathElement.id = id;
  // console.log(pathElement.id);

  // 将<path>元素添加到SVG容器
  svg.appendChild(pathElement);
}
