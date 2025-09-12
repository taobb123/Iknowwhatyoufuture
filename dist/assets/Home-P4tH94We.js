import{R as E,j as e,u as k,r as s,G as L,X as S}from"./index-DSnetD3q.js";import{u as F,a as G,S as C,G as z}from"./useGameData-C0amiSf1.js";import"./Helmet-DhtXy5xI.js";const b=({adSlot:o,adFormat:i="auto",adStyle:c={display:"block"},className:n=""})=>(E.useEffect(()=>{const a=document.createElement("script");a.async=!0,a.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID",a.crossOrigin="anonymous",document.querySelector('script[src*="googlesyndication.com"]')||document.head.appendChild(a);try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch{console.log("AdSense not ready yet")}},[]),e.jsx("div",{className:`ad-banner ${n}`,children:e.jsx("ins",{className:"adsbygoogle",style:c,"data-ad-client":"ca-pub-YOUR_PUBLISHER_ID","data-ad-slot":o,"data-ad-format":i,"data-full-width-responsive":"true"})}));function H({showCategoryTable:o,onTableMouseEnter:i,onTableMouseLeave:c}){var g,x;const n=k(),[a,d]=s.useState(null),[m,f]=s.useState(!1),[u,I]=s.useState(!0),{filteredGames:r,isLoading:p,error:h}=F(),{toggleFavorite:v}=G();s.useEffect(()=>{const t=()=>{f(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",t),document.addEventListener("webkitfullscreenchange",t),document.addEventListener("mozfullscreenchange",t),document.addEventListener("MSFullscreenChange",t),()=>{document.removeEventListener("fullscreenchange",t),document.removeEventListener("webkitfullscreenchange",t),document.removeEventListener("mozfullscreenchange",t),document.removeEventListener("MSFullscreenChange",t)}},[]),s.useEffect(()=>{const t=N=>{N.key==="Escape"&&a&&l()};return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}},[a]);const l=()=>{d(null)},j=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(t){console.error("全屏切换失败:",t)}},w=t=>{n(`/games/${t}`)},y=t=>{v(t)};return e.jsxs("div",{className:"min-h-screen bg-gray-900 text-white",children:[e.jsx(C,{}),e.jsxs("div",{className:"container mx-auto px-4 py-8 pt-24",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h1",{className:"text-4xl font-bold text-yellow-400 mb-4",children:"🎮 免费在线游戏"}),e.jsx("p",{className:"text-gray-300 text-lg",children:"发现最热门的在线游戏，立即开始你的游戏之旅！"})]}),e.jsx("div",{className:"mb-8",children:e.jsx(b,{adSlot:"1234567890",adFormat:"horizontal",className:"w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"})}),h&&e.jsx("div",{className:"mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg",children:e.jsxs("p",{className:"text-red-400",children:["加载游戏时出现错误: ",h]})}),p?e.jsx("div",{className:"flex items-center justify-center py-12",children:e.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[e.jsx("div",{className:"w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"}),e.jsx("p",{className:"text-white/80 text-sm",children:"正在加载游戏..."})]})}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:r.map(t=>e.jsx(L,{children:e.jsx(z,{game:t,variant:"homepage",onPlay:w,onToggleFavorite:y,showRating:!0,showControls:!0})},t.id))})]}),a&&e.jsxs("div",{className:"fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300",onClick:l,children:[e.jsx("div",{className:"flex-shrink-0 z-10",onClick:t=>t.stopPropagation(),children:e.jsx("div",{className:"bg-gradient-to-b from-black/90 to-transparent p-4",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h2",{className:"text-xl font-semibold text-white drop-shadow-lg",children:(g=r.find(t=>t.id===a))==null?void 0:g.title}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:j,className:"p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-white/40",title:m?"退出全屏":"全屏",children:m?"⤓":"⤢"}),e.jsx("button",{onClick:l,className:"p-3 bg-black/50 hover:bg-red-600/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-red-400/60",title:"关闭游戏",children:e.jsx(S,{size:20})})]})]})})}),e.jsxs("div",{className:"flex-1 relative",onClick:t=>t.stopPropagation(),children:[u&&e.jsx("div",{className:"absolute top-4 right-4 z-30",children:e.jsx(b,{adSlot:"0987654321",adFormat:"rectangle",className:"w-48 h-32 bg-gray-800 rounded-lg"})}),e.jsxs("div",{className:"w-full h-full bg-black relative overflow-hidden",children:[u&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/50 z-20",children:e.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[e.jsx("div",{className:"w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"}),e.jsx("p",{className:"text-white/80 text-sm",children:"正在加载游戏..."})]})}),e.jsxs("div",{className:"w-full h-full relative game-iframe-container",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                    .game-iframe-container iframe {
                      width: 100% !important;
                      height: 100% !important;
                      border: none !important;
                      outline: none !important;
                      position: relative;
                      z-index: 1;
                    }
                    
                    .game-iframe-container iframe {
                      filter: contrast(1.05) brightness(1.02) saturate(1.1);
                      transform: scale(1.01);
                      transform-origin: center;
                    }
                    
                    .game-iframe-container::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      height: 80px;
                      background: linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                      z-index: 10;
                      pointer-events: none;
                    }
                    
                    .game-iframe-container::after {
                      content: '';
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      height: 100px;
                      background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                      z-index: 10;
                      pointer-events: none;
                    }
                  `}}),e.jsx("div",{className:"w-full h-full relative",dangerouslySetInnerHTML:{__html:((x=r.find(t=>t.id===a))==null?void 0:x.iframe)||""}})]})]})]})]})]})}export{H as default};
