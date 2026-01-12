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

文件和类型
文件路径：
wx.chooseMessageFile
使用nu-ui 的upload组件（本质是input 获取文件）【里头也许有文件url，没有file】
文件：
uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;
类型：
 wx.chooseMessageFile从文件名字获取到文件类型
uni.getImageInfo；uni.getFileInfo 通过文件路径获取文件信息-文件类型
——————————————————
1. 使用nu-ui 的upload组件（本质是input 获取文件）【里头也许有文件url，没有file】
2. uni.getFileSystemManager()
uniapp提供的对文件的管理：通过文件路径读取本地文件内容（同步）
- readFileSync(filePath: string, encoding?: string): string | ArrayBuffer;

  
