import{c as C,e as I,h as P,r as o,j as e,E as R,d as q,U as K,k as T,l as z}from"./index-BCw3XfMH.js";import{R as Z}from"./RichTextEditor-CcJJrE1j.js";import{M as G}from"./MarkdownRenderer-By8FJgtO.js";import{A as M}from"./arrow-left-C4yDye0w.js";import{S as V}from"./save-Ct9vc84u.js";import{C as $}from"./calendar-B4Glwse2.js";import"./code-BovoTn7x.js";import"./list-Sovbi24v.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=C("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=C("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]),re=()=>{const d=I(),{state:c,getUserDisplayName:h}=P(),[l,E]=o.useState(""),[i,S]=o.useState(""),[x,H]=o.useState("前端开发"),[n,u]=o.useState([]),[m,b]=o.useState(""),[p,L]=o.useState(!1),[y,f]=o.useState({}),A=["前端开发","后端开发","AI/ML","游戏设计","工具使用","王者荣耀"],v=()=>{d("/game-hub")},j=()=>{var s,r;if(!l.trim()||!i.trim()){const a=document.createElement("div");a.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ⚠️ 请填写标题和内容！
        </div>
      `,document.body.appendChild(a),setTimeout(()=>{a.remove()},3e3);return}try{const a=h(),t=T(),Q=z({title:l.trim(),content:i.trim(),author:a,authorId:t?t.id:(s=c.user)==null?void 0:s.id,authorType:t?"regular":((r=c.user)==null?void 0:r.userType)||"guest",category:x,tags:n,status:"published"}),g=document.createElement("div");g.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ✅ 文章发表成功！
        </div>
      `,document.body.appendChild(g),setTimeout(()=>{g.remove();const B=T();d(B?"/game-hub":"/article-management")},2e3)}catch{const t=document.createElement("div");t.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #EF4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ 发表失败，请重试！
        </div>
      `,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}},D=()=>{var s,r;if(!l.trim()||!i.trim()){const a=document.createElement("div");a.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ⚠️ 请填写标题和内容！
        </div>
      `,document.body.appendChild(a),setTimeout(()=>{a.remove()},3e3);return}try{const a=h();z({title:l.trim(),content:i.trim(),author:a,authorId:(s=c.user)==null?void 0:s.id,authorType:((r=c.user)==null?void 0:r.userType)||"guest",category:x,tags:n,status:"draft"});const t=document.createElement("div");t.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3B82F6;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          💾 草稿已保存！
        </div>
      `,document.body.appendChild(t),setTimeout(()=>{t.remove(),d("/article-management")},2e3)}catch{const t=document.createElement("div");t.innerHTML=`
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #EF4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ 保存失败，请重试！
        </div>
      `,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}},N=()=>{m.trim()&&!n.includes(m.trim())&&(u([...n,m.trim()]),b(""))},F=s=>{u(n.filter(r=>r!==s))},U=s=>{s.key==="Enter"&&s.ctrlKey&&j()},w=s=>{f(r=>({...r,[s]:!0}))},k=s=>{f(r=>({...r,[s]:!1}))};return e.jsxs("div",{className:"min-h-screen bg-gray-900 text-white relative",children:[e.jsx("div",{className:"pt-16"}),e.jsx("div",{className:"bg-gray-800 p-4 border-b border-gray-700",children:e.jsxs("div",{className:"max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("button",{onClick:v,className:"flex items-center gap-2 text-gray-300 hover:text-white transition-colors",children:[e.jsx(M,{size:18}),e.jsx("span",{className:"hidden sm:inline",children:"返回攻略社区"})]}),e.jsx("div",{className:"h-6 w-px bg-gray-600 hidden sm:block"}),e.jsx("h1",{className:"text-lg sm:text-xl font-semibold",children:"📝 撰写攻略"})]}),e.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[e.jsxs("button",{onClick:()=>L(!p),className:`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors ${p?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`,children:[e.jsx(R,{size:16}),e.jsx("span",{className:"hidden sm:inline",children:p?"编辑":"预览"})]}),e.jsxs("button",{onClick:D,className:"px-3 sm:px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors",children:[e.jsx(V,{size:16}),e.jsx("span",{className:"hidden sm:inline",children:"保存草稿"})]})]})]})}),e.jsx("div",{className:"max-w-7xl mx-auto p-6",children:e.jsxs("div",{className:"grid grid-cols-12 gap-6",children:[e.jsx("div",{className:"col-span-8",children:e.jsxs("div",{className:"bg-gray-800 rounded-lg p-6",children:[e.jsx("div",{className:"mb-6",children:e.jsx("input",{type:"text",placeholder:"输入攻略标题...",value:l,onChange:s=>E(s.target.value),className:"w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-500",onKeyDown:U})}),e.jsx("div",{className:"mb-6",children:p?e.jsx("div",{className:"min-h-[400px] p-4 bg-gray-700 rounded-lg",children:e.jsxs("div",{className:"prose prose-invert max-w-none",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:l||"无标题"}),e.jsx(G,{content:i||"暂无内容"})]})}):e.jsx(Z,{value:i,onChange:S,placeholder:"开始撰写您的攻略内容...",className:"rounded-lg"})}),e.jsx("div",{className:"text-sm text-gray-400",children:"💡 提示：按 Ctrl + Enter 快速发表文章 | 使用工具栏快速格式化文本"})]})}),e.jsx("div",{className:"col-span-4",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-gray-800 rounded-lg p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold mb-4 flex items-center gap-2",children:[e.jsx(J,{size:20}),"文章信息"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-300 mb-2",children:"分类"}),e.jsx("select",{value:x,onChange:s=>H(s.target.value),className:"w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none",children:A.map(s=>e.jsx("option",{value:s,children:s},s))})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-300 mb-2",children:"标签"}),e.jsxs("div",{className:"flex gap-2 mb-2",children:[e.jsx("input",{type:"text",placeholder:"添加标签...",value:m,onChange:s=>b(s.target.value),onKeyPress:s=>s.key==="Enter"&&N(),className:"flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-sm"}),e.jsx("button",{onClick:N,className:"px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors",children:"添加"})]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:n.map(s=>e.jsxs("span",{className:"px-2 py-1 bg-gray-600 text-gray-300 text-sm rounded-full flex items-center gap-1",children:[e.jsx(q,{size:12}),s,e.jsx("button",{onClick:()=>F(s),className:"ml-1 text-gray-400 hover:text-white",children:"×"})]},s))})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-400",children:[e.jsx(K,{size:16}),e.jsxs("span",{children:["作者：",h()]})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-400",children:[e.jsx($,{size:16}),e.jsxs("span",{children:["发布时间：",new Date().toLocaleDateString("zh-CN")]})]})]})]}),e.jsxs("div",{className:"bg-gray-800 rounded-lg p-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"发布统计"}),e.jsxs("div",{className:"space-y-2 text-sm text-gray-400",children:[e.jsxs("div",{children:["字数：",i.length]}),e.jsxs("div",{children:["标签：",n.length," 个"]}),e.jsxs("div",{children:["分类：",x]})]})]})]})})]})}),e.jsx("div",{className:"fixed right-8 top-1/2 transform -translate-y-1/2 z-50",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:v,onMouseEnter:()=>w("back"),onMouseLeave:()=>k("back"),className:"w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",children:e.jsx(M,{size:24,className:"text-white"})}),y.back&&e.jsxs("div",{className:"absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg",children:["返回攻略社区",e.jsx("div",{className:"absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"})]})]}),e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:j,onMouseEnter:()=>w("publish"),onMouseLeave:()=>k("publish"),className:"w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",children:e.jsx(O,{size:24,className:"text-white"})}),y.publish&&e.jsxs("div",{className:"absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg",children:["发表到攻略列表",e.jsx("div",{className:"absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"})]})]})]})})]})};export{re as default};
