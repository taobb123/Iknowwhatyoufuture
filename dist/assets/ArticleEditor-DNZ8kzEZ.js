import{c as F,h as V,k as J,u as O,a as Q,r as p,j as e,E as W,e as X,U as Y,l as v,m as _}from"./index-BAUYqbCF.js";import{c as $}from"./databaseArticleManager-DhmeV8G7.js";import{S as ee,R as oe}from"./RichTextEditor-BzI9Tytl.js";import{M as se}from"./MarkdownRenderer-BRYbGKG7.js";import{A as H}from"./arrow-left-Bp8fZkE_.js";import{C as re}from"./calendar-D9AdQP1z.js";import"./code-BwXk2gKt.js";import"./list--qPCtZr0.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=F("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=F("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]),he=()=>{const h=V(),{state:i,getUserDisplayName:y}=J(),{currentTheme:o}=O(),{t:r}=Q(),[m,D]=p.useState(""),[c,U]=p.useState(""),[g,I]=p.useState("前端开发"),[d,j]=p.useState([]),[b,w]=p.useState(""),[u,P]=p.useState(!1),[k,N]=p.useState({}),B=["前端开发","后端开发","AI/ML","游戏设计","工具使用","王者荣耀"],C=()=>{h("/game-hub")},T=async()=>{var n,t,S;if(!m.trim()||!c.trim()){const l=document.createElement("div");l.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(l),setTimeout(()=>{l.remove()},3e3);return}if(!v()&&((n=i.user)==null?void 0:n.isGuest)&&!_()){const l=document.createElement("div");l.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
          🚫 当前系统设置禁止游客匿名发表文章，请先注册账户！
        </div>
      `,document.body.appendChild(l),setTimeout(()=>{l.remove()},5e3);return}try{const l=y(),x=v(),ae=await $({title:m.trim(),content:c.trim(),author:l,authorId:x?x.id:(t=i.user)==null?void 0:t.id,authorType:x?"regular":((S=i.user)==null?void 0:S.userType)||"guest",category:g,tags:d,status:"published",likes:0,views:0,comments:0}),f=document.createElement("div");f.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(f),setTimeout(()=>{var L,A;f.remove();const K=v(),Z=((L=i.user)==null?void 0:L.role)==="admin"||((A=i.user)==null?void 0:A.role)==="superAdmin";h(K||!Z?"/game-hub":"/article-management")},2e3)}catch{const x=document.createElement("div");x.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(x),setTimeout(()=>{x.remove()},3e3)}},G=()=>{var s,a;if(!m.trim()||!c.trim()){const n=document.createElement("div");n.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(n),setTimeout(()=>{n.remove()},3e3);return}try{const n=y();addArticle({title:m.trim(),content:c.trim(),author:n,authorId:(s=i.user)==null?void 0:s.id,authorType:((a=i.user)==null?void 0:a.userType)||"guest",category:g,tags:d,status:"draft"});const t=document.createElement("div");t.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(t),setTimeout(()=>{t.remove(),h("/article-management")},2e3)}catch{const t=document.createElement("div");t.innerHTML=`
        <div style="
          position: fixed;
          top: 100px;
          right: 200px;
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
      `,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}},E=()=>{b.trim()&&!d.includes(b.trim())&&(j([...d,b.trim()]),w(""))},R=s=>{j(d.filter(a=>a!==s))},q=s=>{s.key==="Enter"&&s.ctrlKey&&T()},M=s=>{N(a=>({...a,[s]:!0}))},z=s=>{N(a=>({...a,[s]:!1}))};return e.jsxs("div",{className:"min-h-screen relative",style:{backgroundColor:o.colors.background,color:o.colors.text,fontFamily:o.typography.fontFamily},children:[e.jsx("div",{className:"pt-16"}),e.jsx("div",{className:"p-4 border-b",style:{backgroundColor:o.colors.surface,borderColor:o.colors.border},children:e.jsxs("div",{className:"max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("button",{onClick:C,className:"flex items-center gap-2 transition-colors",style:{color:o.colors.textSecondary},onMouseEnter:s=>{s.currentTarget.style.color=o.colors.text},onMouseLeave:s=>{s.currentTarget.style.color=o.colors.textSecondary},children:[e.jsx(H,{size:18}),e.jsx("span",{className:"hidden sm:inline",children:r("common.back")})]}),e.jsx("div",{className:"h-6 w-px hidden sm:block",style:{backgroundColor:o.colors.border}}),e.jsxs("h1",{className:"text-lg sm:text-xl font-semibold",style:{color:o.colors.text},children:["📝 ",r("articleEditor.title")]})]}),e.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[e.jsxs("button",{onClick:()=>P(!u),className:"px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors",style:{backgroundColor:u?o.colors.primary:o.colors.secondary,color:o.colors.text},onMouseEnter:s=>{s.currentTarget.style.backgroundColor=o.colors.hover},onMouseLeave:s=>{s.currentTarget.style.backgroundColor=u?o.colors.primary:o.colors.secondary},children:[e.jsx(W,{size:16}),e.jsx("span",{className:"hidden sm:inline",children:r(u?"articleEditor.editArticle":"articleEditor.preview")})]}),e.jsxs("button",{onClick:G,className:"px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors",style:{backgroundColor:o.colors.secondary,color:o.colors.text},onMouseEnter:s=>{s.currentTarget.style.backgroundColor=o.colors.hover},onMouseLeave:s=>{s.currentTarget.style.backgroundColor=o.colors.secondary},children:[e.jsx(ee,{size:16}),e.jsx("span",{className:"hidden sm:inline",children:r("articleEditor.saveDraft")})]})]})]})}),e.jsx("div",{className:"max-w-7xl mx-auto p-6",children:e.jsxs("div",{className:"grid grid-cols-12 gap-6",children:[e.jsx("div",{className:"col-span-8",children:e.jsxs("div",{className:"rounded-lg p-6",style:{backgroundColor:o.colors.surface,borderColor:o.colors.border,border:"1px solid",boxShadow:o.shadows.lg},children:[e.jsx("div",{className:"mb-6",children:e.jsx("input",{type:"text",placeholder:r("articleEditor.articleTitle"),value:m,onChange:s=>D(s.target.value),className:"w-full text-2xl font-bold bg-transparent border-none outline-none",style:{color:o.colors.text,fontFamily:o.typography.fontFamily},onKeyDown:q})}),e.jsx("div",{className:"mb-6",children:u?e.jsx("div",{className:"min-h-[400px] p-4 rounded-lg",style:{backgroundColor:o.colors.background},children:e.jsxs("div",{className:"prose prose-invert max-w-none",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",style:{color:o.colors.text},children:m||"无标题"}),e.jsx(se,{content:c||"暂无内容"})]})}):e.jsx(oe,{value:c,onChange:U,placeholder:r("articleEditor.articleContent"),className:"rounded-lg"})}),e.jsx("div",{className:"text-sm",style:{color:o.colors.textSecondary},children:"💡 提示：按 Ctrl + Enter 快速发表文章 | 使用工具栏快速格式化文本"})]})}),e.jsx("div",{className:"col-span-4",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"rounded-lg p-6",style:{backgroundColor:o.colors.surface,borderColor:o.colors.border,border:"1px solid",boxShadow:o.shadows.lg},children:[e.jsxs("h3",{className:"text-lg font-semibold mb-4 flex items-center gap-2",style:{color:o.colors.text},children:[e.jsx(te,{size:20}),r("articleEditor.articleTitle")]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-2",style:{color:o.colors.textSecondary},children:r("articleEditor.articleCategory")}),e.jsx("select",{value:g,onChange:s=>I(s.target.value),className:"w-full p-3 rounded-lg focus:outline-none",style:{backgroundColor:o.colors.background,borderColor:o.colors.border,border:"1px solid",color:o.colors.text},children:B.map(s=>e.jsx("option",{value:s,children:s},s))})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-2",style:{color:o.colors.textSecondary},children:r("articleEditor.articleTags")}),e.jsxs("div",{className:"flex gap-2 mb-2",children:[e.jsx("input",{type:"text",placeholder:"添加标签...",value:b,onChange:s=>w(s.target.value),onKeyPress:s=>s.key==="Enter"&&E(),className:"flex-1 p-2 rounded-lg focus:outline-none text-sm",style:{backgroundColor:o.colors.background,borderColor:o.colors.border,border:"1px solid",color:o.colors.text}}),e.jsx("button",{onClick:E,className:"px-3 py-2 rounded-lg text-sm transition-colors",style:{backgroundColor:o.colors.primary,color:o.colors.text},onMouseEnter:s=>{s.currentTarget.style.backgroundColor=o.colors.hover},onMouseLeave:s=>{s.currentTarget.style.backgroundColor=o.colors.primary},children:r("common.submit")})]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:d.map(s=>e.jsxs("span",{className:"px-2 py-1 text-sm rounded-full flex items-center gap-1",style:{backgroundColor:o.colors.secondary,color:o.colors.text},children:[e.jsx(X,{size:12}),s,e.jsx("button",{onClick:()=>R(s),className:"ml-1 hover:opacity-70 transition-opacity",style:{color:o.colors.textSecondary},children:"×"})]},s))})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",style:{color:o.colors.textSecondary},children:[e.jsx(Y,{size:16}),e.jsxs("span",{children:["作者：",y()]})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",style:{color:o.colors.textSecondary},children:[e.jsx(re,{size:16}),e.jsxs("span",{children:["发布时间：",new Date().toLocaleDateString("zh-CN")]})]})]})]}),e.jsxs("div",{className:"rounded-lg p-6",style:{backgroundColor:o.colors.surface,borderColor:o.colors.border,border:"1px solid",boxShadow:o.shadows.lg},children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",style:{color:o.colors.text},children:"发布统计"}),e.jsxs("div",{className:"space-y-2 text-sm",style:{color:o.colors.textSecondary},children:[e.jsxs("div",{children:["字数：",c.length]}),e.jsxs("div",{children:["标签：",d.length," 个"]}),e.jsxs("div",{children:["分类：",g]})]})]})]})})]})}),e.jsx("div",{className:"fixed right-8 top-1/2 transform -translate-y-1/2 z-50",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:C,onMouseEnter:()=>M("back"),onMouseLeave:()=>z("back"),className:"w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",style:{backgroundColor:o.colors.secondary,color:o.colors.text},children:e.jsx(H,{size:24})}),k.back&&e.jsxs("div",{className:"absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg",style:{backgroundColor:o.colors.surface,color:o.colors.text,borderColor:o.colors.border,border:"1px solid"},children:["返回攻略社区",e.jsx("div",{className:"absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent",style:{borderLeftColor:o.colors.surface}})]})]}),e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:T,onMouseEnter:()=>M("publish"),onMouseLeave:()=>z("publish"),className:"w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",style:{backgroundColor:o.colors.primary,color:o.colors.text},children:e.jsx(le,{size:24})}),k.publish&&e.jsxs("div",{className:"absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg",style:{backgroundColor:o.colors.surface,color:o.colors.text,borderColor:o.colors.border,border:"1px solid"},children:["发表到攻略列表",e.jsx("div",{className:"absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent",style:{borderLeftColor:o.colors.surface}})]})]})]})})]})};export{he as default};
