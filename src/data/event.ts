export const event={
 id:'case001_demo_library',title:'明明写着24小时开放，图书馆为什么突然关灯？',shortTitle:'图书馆里的十五秒',label:'虚构事件 · 交互演示',
 article:'一段十五秒的短视频在旅客间传开：工作人员提醒读者离开，主阅览室的灯光随即调暗。发布者在视频旁写下：“宣传说24小时开放，为什么现在就要走？”',
 publisher:'读者的短视频账号（虚构）',publishedAt:'22:10',question:'基于目前掌握的信息，你更接近以下哪种判断？',
 options:[{id:'A',text:'馆方的现场处理方式可能存在问题。'},{id:'B',text:'馆方可能是在正常执行管理规定。'},{id:'C',text:'目前信息不足，我想先了解更多。'}],
 comments:['写着24小时开放，为什么还要离开？','也可能是不同区域的时间不同。','现场沟通到底是什么情况？'],
 clips:[{id:'before',time:'21:56',title:'前置提醒',source:'读者补充记录（虚构）',caption:'工作人员：主阅览室将在22:00关闭，请大家整理随身物品。',frames:['阅览室里仍有读者在学习。','工作人员走到桌边，提醒即将闭馆。','画面未完整记录每一桌的交流。']},{id:'initial',time:'21:58',title:'最初传播的十五秒',source:'最初传播视频（虚构）',caption:'工作人员提醒离开；灯光调暗。拍摄者：“不是24小时开放吗？”',frames:['工作人员：“请收拾物品，准备离开。”','部分灯光调暗，镜头转向宣传标语。','拍摄者：“不是24小时开放吗？”']},{id:'after',time:'22:03',title:'后续指引',source:'另一读者的独立记录（虚构）',caption:'工作人员：一楼通宵自习区仍开放，可以到那里继续学习。',frames:['主阅览室开始关闭。','工作人员指向一楼自习区入口。','这段记录来自另一位读者，并非原视频连续镜头。']}],
 timeline:[{id:'a',time:'21:45',text:'图书馆播放闭馆广播'},{id:'b',time:'21:56',text:'工作人员提醒学生整理物品'},{id:'c',time:'21:58',text:'最初传播视频开始拍摄'},{id:'d',time:'22:00',text:'主阅览室进入闭馆流程'},{id:'e',time:'22:03',text:'工作人员指引其他学习区域'}],
 messages:[{id:'first',time:'22:10',text:'最早传播的视频'},{id:'second',time:'22:35',text:'二次转发报道'},{id:'response',time:'23:05',text:'图书馆后续回应'}],
 evidence:[{id:'video',name:'视频上下文',summary:'十五秒之外还有前置提醒和后续指引，三段记录来源不同。',category:'已核实信息'},{id:'notice',name:'区域开放规定',summary:'一楼通宵自习区全天开放，主阅览室开放至22:00。',category:'已核实信息'},{id:'timeline',name:'完整事件时间线',summary:'广播、提醒、拍摄、闭馆与引导其他区域按时间依次发生。',category:'已核实信息'},{id:'witness',name:'现场证词',summary:'双方对提醒的语气和解释是否充分存在不同说法。',category:'不同说法'},{id:'spread',name:'标题传播记录',summary:'从“发生争论”到“关灯赶学生”，再到“无故驱赶”，措辞逐渐增强。',category:'已核实信息'}],
 claims:[{id:'hours',question:'是否承诺整馆24小时开放？',answer:'notice',feedback:'完整公告区分一楼通宵自习区与主阅览室。整馆24小时开放的说法缺少依据。',category:'已核实信息'},{id:'context',question:'十五秒是否包含完整交流？',answer:'video',feedback:'不包含。前置提醒与后续指引来自两段独立补充记录。',category:'已核实信息'},{id:'communication',question:'现场沟通是否已经充分确认？',answer:'unresolved',feedback:'尚未确认。已有时间线不能证明语气、具体解释和每位读者的感受；双方说法仍有分歧。',category:'尚待核实'}],
 witnesses:[{name:'现场读者',text:'我听见了闭馆提醒，但当时没有听清还有哪里能继续学习。我觉得现场解释很仓促。',common:'听见了闭馆提醒',difference:'解释很仓促'},{name:'工作人员',text:'我们提前广播并提醒闭馆，也告知可以前往一楼。现场人多，可能有人没有听清。',common:'提前广播并提醒闭馆',difference:'也告知可以前往一楼'}],
 headlines:[{source:'原始视频说明',text:'闭馆时与工作人员发生争论',word:'发生争论'},{source:'二次转发标题',text:'24小时图书馆关灯赶学生',word:'关灯赶学生'},{source:'再次传播标题',text:'图书馆无故驱赶学习的学生',word:'无故驱赶'}],
 broadcasts:[{id:'1',text:'下一站，我们将迎来一位特别的旅客……'},{id:'2',text:'这位旅客似乎带来了一件值得大家讨论的事情……'},{id:'3',text:'更多消息，将在下一站揭晓。'}],
 discussion:['即便有闭馆规定，执行时如何照顾现场感受？','真实但不完整的视频，会怎样影响我们的判断？','转发仍有争议的消息时，哪些内容值得保留？']
};
export const voteLabel=(id:string|null|undefined)=>event.options.find(o=>o.id===id)?.text||'尚未记录';
