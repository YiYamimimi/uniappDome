按钮点击：
1. wx.chooseMessageFile(Object object)
微信提供的选择文件（图片，视频，文件）的方法【文件名字和文件路径，从文件名字获取到文件类型】
<img width="650" height="334" alt="image" src="https://github.com/user-attachments/assets/01fb5d38-fbf6-4474-a1d7-b386b501d83f" />

2. uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;

使用upload组件（本质是input 获取文件）
uni.getImageInfo：通过文件路径获取文件类型

uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;

# 小程序上传：
文件和类型
1. 文件路径：选择文件
wx.chooseMessageFile
2. 文件：
uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;
3. 类型：
 wx.chooseMessageFile从文件名字获取到文件类型
uni.getImageInfo；uni.getFileInfo 通过文件路径获取文件信息-文件类型

——————————————————
1. 使用nv-ui 的upload组件
      1. 用了nv-ui上传组件，
      2. 其底层调用uni.chooseImage() 返回:
      {
          tempFilePaths: ["http://tmp/xxx.png"],
          tempFiles: [{ path: "http://tmp/xxx.png", size: 2014 }]
      }
      3. 封装type:image
      4. uni.chooseImage() 在小程序中调用wx.chooseImage() ，其返回：
         <img width="1594" height="892" alt="image" src="https://github.com/user-attachments/assets/e5c084ac-bc64-497d-8380-ff1655a2eaa3" />

 ∴只能👇
2. uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;
  
# web端上传：
3. and design（本质是input 获取文件）【会返回file对象】

  
