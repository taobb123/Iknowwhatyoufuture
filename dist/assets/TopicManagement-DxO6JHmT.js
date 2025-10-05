import{b as V,u as W,r,j as e}from"./index-Du8BMbyU.js";import{g as Y,a as Z,u as _,d as ee}from"./databaseTopicManager-vpp9uVJX.js";import{g as se}from"./databaseBoardManager-DAhEahQI.js";import{S as te,a as oe,b as ne,c as re,d as le,e as m,f as y,g as f,h as v,i as ae,j as ie,k as de,l as ce,m as xe,n as he,o as me,p as pe,q as je,r as I,s as T,A as N,t as k,u as l,x as S,v as C,w as D,B as A,z as M}from"./StyledManagementPage-63J9W30c.js";import{A as ue}from"./arrow-left-gJmRVtYo.js";import{P as ge}from"./plus-BASjHXxA.js";import{C as ye}from"./calendar-DRkchnUS.js";const Ne=()=>{const L=V(),{currentTheme:i}=W(),[d,p]=r.useState([]),[j,z]=r.useState([]),[P,E]=r.useState(!0),[X,u]=r.useState(!1),[H,w]=r.useState(!1),[B,b]=r.useState(null),[c,F]=r.useState(null),[x,h]=r.useState(""),[t,n]=r.useState({name:"",description:"",icon:"🌟",color:"from-yellow-500 to-orange-500"});r.useEffect(()=>{$()},[]);const $=async()=>{try{console.log("加载主题和板块数据...");const s=await se();z(s);const o=await Y();p(o),console.log("加载的数据:",{boards:s.length,topics:o.length}),E(!1)}catch(s){console.error("加载数据失败:",s),E(!1)}},q=async()=>{if(!x){const s=document.createElement("div");s.innerHTML=`
        <div style="
          position: fixed;
          top: 150px;
          right: 200px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        ">
          ⚠️ 请选择所属板块
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `,document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},3e3);return}try{console.log("创建主题:",{...t,boardId:x});const s=await Z({...t,boardId:x,order:0,isActive:!0});p([...d,s]),u(!1),n({name:"",description:"",icon:"🌟",color:"from-yellow-500 to-orange-500"}),h(""),console.log("主题创建成功")}catch(s){console.error("创建主题失败:",s)}},R=async()=>{if(c)try{console.log("更新主题:",c.id,t);const s=await _(c.id,{...t,boardId:x,order:c.order,isActive:c.isActive});p(d.map(o=>o.id===c.id?s:o)),w(!1),F(null),n({name:"",description:"",icon:"🌟",color:"from-yellow-500 to-orange-500"}),h(""),g("主题更新成功！","success"),console.log("主题更新成功")}catch(s){console.error("更新主题失败:",s),g("主题更新失败，请重试","error")}},G=async s=>{try{console.log("删除主题:",s),await ee(s)&&(p(d.filter(a=>a.id!==s)),b(null),g("主题删除成功！","success"),console.log("主题删除成功"))}catch(o){console.error("删除主题失败:",o),g("主题删除失败，请重试","error")}},J=s=>{F(s),n({name:s.name,description:s.description,icon:s.icon,color:s.color}),h(s.boardId),w(!0)},K=s=>{const o=j.find(a=>a.id===s);return o?o.name:"未知板块"},O=s=>new Date(s).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),g=(s,o)=>{const a=document.createElement("div"),Q=o==="success"?i.colors.success:i.colors.error,U=o==="success"?"✅":"❌";a.innerHTML=`
      <div style="
        position: fixed;
        top: 150px;
        right: 200px;
        background: ${Q};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
      ">
        ${U} ${s}
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},3e3)};return P?e.jsx("div",{className:"min-h-screen text-white flex items-center justify-center",style:{backgroundColor:i.colors.background},children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4",style:{borderColor:i.colors.textSecondary}}),e.jsx("p",{style:{color:i.colors.text},children:"加载中..."})]})}):e.jsx(te,{children:e.jsxs(oe,{children:[e.jsxs(ne,{children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs(re,{onClick:()=>L(-1),children:[e.jsx(ue,{size:16}),"返回"]}),e.jsx(le,{children:"主题管理"})]}),e.jsxs(m,{onClick:()=>u(!0),children:[e.jsx(ge,{size:16}),"创建主题"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8",children:[e.jsxs(y,{children:[e.jsx(f,{children:d.length}),e.jsx(v,{children:"总主题数"})]}),e.jsxs(y,{children:[e.jsx(f,{children:d.filter(s=>s.isActive).length}),e.jsx(v,{children:"活跃主题"})]}),e.jsxs(y,{children:[e.jsx(f,{children:j.length}),e.jsx(v,{children:"总板块数"})]}),e.jsxs(y,{children:[e.jsx(f,{children:"0"}),e.jsx(v,{children:"总文章数"})]})]}),e.jsxs(ae,{children:[e.jsx(ie,{children:"主题列表"}),d.length===0?e.jsxs(de,{children:[e.jsx(ce,{children:"暂无主题数据"}),e.jsx(m,{onClick:()=>u(!0),children:"创建第一个主题"})]}):e.jsx("div",{className:"space-y-4",children:d.map(s=>e.jsxs(xe,{children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("span",{className:"text-2xl",children:s.icon}),e.jsxs("div",{children:[e.jsx(he,{children:s.name}),e.jsx(me,{children:s.description}),e.jsxs(pe,{children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(ye,{size:12}),O(s.createdAt)]}),e.jsxs("span",{children:["所属板块: ",K(s.boardId)]}),e.jsx(je,{isActive:s.isActive,children:s.isActive?"活跃":"已关闭"})]})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-sm",style:{color:i.colors.textSecondary},children:[s.articleCount," 篇文章"]}),e.jsx(m,{onClick:()=>J(s),className:"px-3 py-1 text-sm",children:"编辑"}),e.jsx(I,{onClick:()=>b(s.id),className:"px-3 py-1 text-sm",children:"删除"})]})]},s.id))})]}),X&&e.jsxs(T,{hasFixedFooter:!0,children:[e.jsxs(N,{children:[e.jsx(k,{children:"创建主题"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx(l,{children:"所属板块"}),e.jsxs(S,{value:x,onChange:s=>h(s.target.value),children:[e.jsx("option",{value:"",children:"选择板块"}),j.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"主题名称"}),e.jsx(C,{type:"text",value:t.name,onChange:s=>n({...t,name:s.target.value}),placeholder:"输入主题名称"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"主题描述"}),e.jsx(D,{value:t.description,onChange:s=>n({...t,description:s.target.value}),rows:3,placeholder:"输入主题描述"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"图标"}),e.jsx(C,{type:"text",value:t.icon,onChange:s=>n({...t,icon:s.target.value}),placeholder:"选择图标"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"颜色"}),e.jsxs(S,{value:t.color,onChange:s=>n({...t,color:s.target.value}),children:[e.jsx("option",{value:"from-yellow-500 to-orange-500",children:"黄色到橙色"}),e.jsx("option",{value:"from-purple-500 to-pink-500",children:"紫色到粉色"}),e.jsx("option",{value:"from-indigo-500 to-blue-500",children:"靛蓝到蓝色"}),e.jsx("option",{value:"from-green-500 to-teal-500",children:"绿色到青色"})]})]})]})]}),e.jsxs(A,{children:[e.jsx(M,{onClick:()=>u(!1),children:"取消"}),e.jsx(m,{onClick:q,children:"创建"})]})]}),H&&e.jsxs(T,{hasFixedFooter:!0,children:[e.jsxs(N,{children:[e.jsx(k,{children:"编辑主题"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx(l,{children:"所属板块"}),e.jsxs(S,{value:x,onChange:s=>h(s.target.value),children:[e.jsx("option",{value:"",children:"选择板块"}),j.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"主题名称"}),e.jsx(C,{type:"text",value:t.name,onChange:s=>n({...t,name:s.target.value}),placeholder:"输入主题名称"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"主题描述"}),e.jsx(D,{value:t.description,onChange:s=>n({...t,description:s.target.value}),rows:3,placeholder:"输入主题描述"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"图标"}),e.jsx(C,{type:"text",value:t.icon,onChange:s=>n({...t,icon:s.target.value}),placeholder:"选择图标"})]}),e.jsxs("div",{children:[e.jsx(l,{children:"颜色"}),e.jsxs(S,{value:t.color,onChange:s=>n({...t,color:s.target.value}),children:[e.jsx("option",{value:"from-yellow-500 to-orange-500",children:"黄色到橙色"}),e.jsx("option",{value:"from-purple-500 to-pink-500",children:"紫色到粉色"}),e.jsx("option",{value:"from-indigo-500 to-blue-500",children:"靛蓝到蓝色"}),e.jsx("option",{value:"from-green-500 to-teal-500",children:"绿色到青色"})]})]})]})]}),e.jsxs(A,{children:[e.jsx(M,{onClick:()=>w(!1),children:"取消"}),e.jsx(m,{onClick:R,children:"保存"})]})]}),B&&e.jsxs(T,{children:[e.jsxs(N,{children:[e.jsx(k,{children:"确认删除"}),e.jsx("p",{className:"mb-6",style:{color:i.colors.textSecondary},children:"确定要删除这个主题吗？此操作不可撤销。"})]}),e.jsxs(A,{children:[e.jsx(M,{onClick:()=>b(null),children:"取消"}),e.jsx(I,{onClick:()=>G(B),children:"删除"})]})]})]})})};export{Ne as default};
