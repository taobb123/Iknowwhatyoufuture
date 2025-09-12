# React组件模板

## 组件名称
```jsx
import React, { useState, useEffect } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX内容 */}
    </div>
  );
};

export default ComponentName;
```

## 使用说明
1. 复制上述代码
2. 修改组件名称和属性
3. 添加具体的业务逻辑
4. 在父组件中导入使用

## 效果
- 创建可复用的React组件
- 实现状态管理和生命周期
- 提供良好的开发体验