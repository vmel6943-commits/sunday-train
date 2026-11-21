import type {CharacterId} from './config';
import {crewCredit, journeyTitle} from './identity';
export interface DialogueSpec {id:string;character:CharacterId;lines:string[];endLabel?:string;choices?:{label:string;response:string}[];}
export const dialogues:Record<string,DialogueSpec>={
 welcome:{id:'welcome',character:'captain',lines:[`欢迎来到《${journeyTitle}》。我们是${crewCredit}，这趟从周一开出的列车，为你留了一个座位。`,'我是列车长胡焯薇。桌上那封盖着火漆的信是给你的。拆开它，我们就出发。']},
 attendant:{id:'attendant',character:'attendant',lines:['欢迎来到 G-07 车站！我是今天负责检票的乘务员马雨秋。','让我看看……嗯，行李没有超重，精神状态看起来也不错。请问你的车票在哪里？','邀请函已经替你留好了位置。跟我来，给车票写上一个喜欢的名字，就能登车了。'],choices:[{label:'为什么邀请函没说要买票？',response:'因为它是一份邀请，车票不收钱。我们只需要知道，你想以什么名字登车。'},{label:'我的目的地到底在哪里？',response:'第一站是今晚，后面的站点会陆续揭晓。你可以先选个喜欢的座位。'},{label:'这里到底是什么地方？',response:'一辆愿意停下来听不同故事的列车。你带着问题来，也可以带着问题离开。'}]},
 boarded:{id:'boarded',character:'attendant',lines:['欢迎登车！你的行李已经放好，窗外的灯火开始慢慢后退。','这是你的七日路线图与旅行手账。车厢尽头那位提着大皮箱的旅客，似乎带来了一份特别的消息。']},
 spy:{id:'spy',character:'spy',lines:['你好，我是周紫琳。我的皮箱里，装着同一件事的不同版本。','第一份情报，似乎已经准备好了。要不要看看这只皮箱里，究竟藏着什么？'],choices:[{label:'先看看今天的报道。',response:'请坐。桌上的《列车专报》只呈现最初传来的消息。看完以后，你可以先留下判断。'},{label:'你为什么收集这些材料？',response:'同一件事，有人看见开头，有人听见结尾。我喜欢把它们放在同一张桌上。'},{label:'我想先在远处观察。',response:'当然。皮箱不会催你，桌上的报纸也一直在这里。'}]},
 afterInvestigation:{id:'afterInvestigation',character:'spy',lines:['皮箱里的材料，你已经看过了。判断可以改变，也可以保持，疑问同样值得记录。','这份调查记录是你的。餐车已经开门，乘务鹅想听听你今天最想记住的事。','接下来的时间属于你。去餐车尝点甜的，看看窗外，或听听广播。想结束今晚的旅程时，来手账台盖章就好。']},
 journal:{id:'journal',character:'journalist',lines:['我是邓琴，替这辆列车照看旅行手账。你找到的东西，都会留在这里。','登车、调查、夜行奇遇，各占一页。随意逛逛吧。想把今晚收藏起来时，来手账台盖一枚章就好。']},
 ending:{id:'ending',character:'captain',lines:['感谢你搭乘开往周日的列车。你在旅途中留下的选择与发现，都已经被好好收藏。','下一站，我们将迎来一位特别的旅客。更多消息，将在下一站揭晓。','你可以继续探索列车，也可以带着今天的手账，等下一次汽笛响起。']}
};
export const letter='亲爱的旅客：\n\n当你看到这封信时，开往周日的列车即将启程。\n\n我们将用七天的时间，经过七段不同的旅程。在这里，你可能遇见有趣的人、听见离奇的消息，也可能重新认识一些原本熟悉的事。\n\n每个人都能带走一份属于自己的旅行记录。\n\n但在此之前，你需要找到前往列车的入口。\n\n请在最后一声汽笛响起前登车。\n\n——列车事务局';
