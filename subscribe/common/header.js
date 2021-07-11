let db = require('./mysql')
const uuidv4 = require('uuid/v4');

let arr = [{
        "title": "A、在线辐射监测系统",
        "list": [{
                "sonTitle": "A1、辐射早期预警系统",
                "sonlist": [
                    "A1.1、辐射环境自动监测站",
                    "A1.1、ROMS1000电磁、电离辐射自动站",
                    "A1.3、RS-detection高压电离室",
                    "A1.3、RS-detection高压电离室",
                    "A1.5、1100系列投放式辐射监测系统",
                    "A1.6、ASS系列超大流量空气采样系统",
                    "A1.7、GHZ-A浸水式水中 γ 放射性监测系统",
                    "A1.8、GHZ-B引水式水中放射性监测系统",
                    "A1.9、GHZ-C饮用水放射性连续监测系统"
                ]
            },
            {
                "sonTitle": "A1.9、惰性气体、气溶胶、碘和氚在线监测系统",
                "sonlist": [
                    "A2.1、超大流量γ气溶胶连续监测系统",
                    "A2.2、惰性气体连续监测系统",
                    "A2.3、α、β气溶胶及碘连续监测系统"
                ]
            }
        ]
    },
    {
        "title": "B、核应急与反恐",
        "list": [{
                "sonTitle": "B1、ROMS300单兵应急辐射监测系"
            },
            {
                "sonTitle": "B2、PGIS-2背包式寻源系"
            },
            {
                "sonTitle": "B3、Drone-G多旋翼无人机辐射应急巡测系统"
            },
            {
                "sonTitle": "B4、GHZ 8302无人机辐射应急巡测系统"
            },
            {
                "sonTitle": "B5、无人船应急辐射巡测系"
            },
            {
                "sonTitle": "B6、车载辐射监测系"
            },
            {
                "sonTitle": "B7、IRIS-Mobile车载放射性巡测系"
            },
            {
                "sonTitle": "B8、遥控机器"
            },
            {
                "sonTitle": "B9、NuVISION γ相"
            },
            {
                "sonTitle": "B10、GeGI5高分辨率γ"
            },
            {
                "sonTitle": "B11、FoodGuard-1便携式食品水样测量"
            },
            {
                "sonTitle": "B12、STC系列便携式α、β计数"
            },
            {
                "sonTitle": "B13、移动实验室"
            }
        ]
    },
    {
        "title": "C、保健物理仪器",
        "list": [{
                "sonTitle": "C1、便携式γ、中子剂量仪",
                "sonlist": [
                    "C1、便携式γ、中子剂量仪",
                    "C1.2、IFP2100便携式环境x、γ监测",
                    "C1.3、GHZ2000便携式环境x、γ剂量",
                    "C1.4、AT1123便携式连续/短期辐射检测仪",
                    "C1.5、FHT762-WENDI2便携式中子测量仪",
                    "C1.6、Neutron Snooper便携式超高灵敏中子测量"
                ]
            },
            {
                "sonTitle": "C2、便携式γ谱仪",
                "sonlist": [
                    "C2.1、GHZ100便携式γ谱",
                    "C2.2、SAM950型手持式伽玛",
                    "C2.3、Fulcrum-25便携式HPGe谱仪",
                    "C2.4、Detective便携式HPGe谱",
                    "C2.5、Falcon 5000便携式高纯锗谱",
                    "C2.6、Aegis多用途便携式高纯锗谱仪"
                ]
            },
            {
                "sonTitle": "C3、表面污染监测仪",
                "sonlist": [
                    "C3.1、CoMo170便携式表面污染监测仪",
                    "C3.1、CoMo170便携式表面污染监测仪",
                    "C3.3、RMS MC 345便携式表面污染监测仪",
                    "C3.4、FloorScan地面污染测量仪"
                ]
            },
            {
                "sonTitle": "C4、个人剂量报警仪",
                "sonlist": [
                    "C4、个人剂量报警仪",
                    "C4.2、GHZ1300个人γ/中子剂量",
                    "C4.4、RadEye GN高灵敏度便携式γ/中子测量",
                    "C4.5、RADEYE PRD个人辐射测量仪",
                    "C4.6、GHZ7102个人气溶胶测量",
                    "C4.6、GHZ7102个人气溶胶测量"
                ]
            },
            {
                "sonTitle": "C5、便携式氚监测仪"
            },
            {
                "sonTitle": "C6、测氡仪",
                "sonlist": [
                    "C6、测氡仪",
                    "C6.2、RAD-7测氡",
                    "C6.3、DF2000脉冲电离室氡、钍及子体测量仪",
                    "C6.4、AB7便携式镭、氡测量仪"
                ]
            },
            {
                "sonTitle": "C7、手足、工具、全身污染监测仪",
                "sonlist": [
                    "C7.1、BodyScan全身α、β沾污测量仪",
                    "C7.2.、StandFAST II全身计数器",
                    "C7.3、HFC Scan手足、衣物污染检测仪",
                    "C7.4、WasteSCAN废物桶、工具污染检测仪"
                ]
            },
            {
                "sonTitle": "C8、气溶胶、碘惰性气体连续监测系统",
                "sonlist": [
                    "C8.1、CPM-310M碘连续监测系",
                    "C8.2、GHZ7100气溶胶监测系统",
                    "C8.3、RMS TriNo氚、惰性气体监测仪",
                    "C8.4、GHZ7000气载放射性流出物在线监测系统"
                ]
            },
            {
                "sonTitle": "C9、区域辐射监测系统",
                "sonlist": [
                    "C9.1、GHZ2500区域辐射监测系统",
                    "C9.2、EFRD2100系列区域辐射监测系统",
                    "C9.2、EFRD2100系列区域辐射监测系统"
                ]
            },
            {
                "sonTitle": "C10、核辐射防护套装",
                "sonlist": [
                    "C10.1、Demron全封闭式核辐射防护服",
                    "C10.2、A级防护服",
                    "C10.3、射线防护套",
                    "C10.4、中子防护"
                ]
            },
            {
                "sonTitle": "C11、电磁辐射检测仪",
                "sonlist": [
                    "C11.1、NBM550宽频电磁辐射分析",
                    "C11.2、NBM550射频综合场强分析仪",
                    "C11.3、NBM550工频电磁场分析",
                    "C11.4、NBM550电磁环境场强测试探头",
                    "C11.5、SRM3006选频电磁辐射测量",
                    "C11.6、PMM9010电磁干扰场强分析",
                    "C11.7、ELT400家用电器辐射分析仪",
                    "C11.8、ESM20电磁辐射个人报警仪",
                    "C11.9、ROMS500直流电合成场强检测系统"
                ]
            }
        ]
    },
    {
        "title": "D、实验室分析与测量仪器",
        "list": [{
                "sonTitle": "D1、ORTEC实验室高纯锗γ谱仪"
            },
            {
                "sonTitle": "D2、Canberra实验室高纯锗γ"
            },
            {
                "sonTitle": "D3、DigiBASE实验室NaI（LaBr3）谱仪"
            },
            {
                "sonTitle": "D4、CosmicGuard反宇宙射线高纯锗γ谱"
            },
            {
                "sonTitle": "D5、MPC9604低本底总α、β计数器"
            },
            {
                "sonTitle": "D6、LB4200低本底总α、β计数器"
            },
            {
                "sonTitle": "D7、iMatic全自动换样低本底α、β计数"
            },
            {
                "sonTitle": "D8、Alpha Analyst多路α谱"
            },
            {
                "sonTitle": "D9、Alpha Ensemble多路α谱"
            },
            {
                "sonTitle": "D10、LSC-LB7超低本底液闪谱仪"
            },
            {
                "sonTitle": "D11、GCT 6220超低本底液闪谱仪"
            },
            {
                "sonTitle": "D12、Harshaw系列热释光测量系"
            },
            {
                "sonTitle": "D13、FGD系列光释光测量系统"
            },
            {
                "sonTitle": "D14、Taslimage固体径迹蚀刻测量系"
            },
            {
                "sonTitle": "D15、REM500中子谱"
            },
            {
                "sonTitle": "D16、原子吸收分光光谱仪"
            },
            {
                "sonTitle": "D17、ZEISS Axio Imager Z2染色体自 动分析仪"
            },
            {
                "sonTitle": "D18、Element2高分辨率电感耦合等离 子体质谱仪"
            }
        ]
    },
    {
        "title": "E、样品采集与制备",
        "list": [{
                "sonTitle": "E1、气溶胶和碘采样器",
                "sonlist": [
                    "E1.1、VOPV-10大流量气溶胶和碘采样器",
                    "E1.2、CF-1000BRL系列空气采样器",
                    "E1.3、VOPV-12大流量空气采样",
                    "E1.4、超大流量气溶胶分级采样系统"
                ]
            },
            {
                "sonTitle": "E2、氚/碳采样器",
                "sonlist": [
                    "E2.1、Tri-Car系列H-3/C-14采样器",
                    "E2.2、TS-212多形态氚取样系"
                ]
            },
            {
                "sonTitle": "E3、惰性气体采样器"
            },
            {
                "sonTitle": "E4、TB-101型有机氚碳氧化燃烧装置"
            },
            {
                "sonTitle": "E5、氚电解浓缩装置",
                "sonlist": [
                    "E5.1、HJ系列氚电解浓缩系统",
                    "E5.2、SPE171氚电解浓缩装置"
                ]
            },
            {
                "sonTitle": "E6、多路电沉积仪"
            },
            {
                "sonTitle": "E7、全自动放射性水样蒸发浓缩仪"
            },
            {
                "sonTitle": "E8、EB7/6颚式粉碎仪"
            },
            {
                "sonTitle": "E9、PM400行星式球磨仪"
            },
            {
                "sonTitle": "E10、GHZ-RK600A大体积马弗炉"
            },
            {
                "sonTitle": "E11、微波材料学工作站"
            },
            {
                "sonTitle": "E12、超声&微波化学工作站"
            }
        ]
    },
    {
        "title": "F、国土安全",
        "list": [{
                "sonTitle": "F1、GHZ3215可移动门式辐射监测仪"
            },
            {
                "sonTitle": "F2、ASM IV系列包裹/货物/车辆/人员辐射监测系统"
            },
            {
                "sonTitle": "F3、行李包裹辐射监测系统"
            }
        ]
    },
    {
        "title": "G、退役、去污洗消",
        "list": [{
                "sonTitle": "G1、废物桶测量系统"
            },
            {
                "sonTitle": "G2、地面污染测量车"
            },
            {
                "sonTitle": "G3、无人机三维辐射监测系统"
            },
            {
                "sonTitle": "G4、洗消去污装置"
            },
            {
                "sonTitle": "G5、覆盖去污洗消装置"
            },
            {
                "sonTitle": "G6、核生化应急救治车"
            },
            {
                "sonTitle": "G7、核化去污洗消车"
            }
        ]
    },
    {
        "title": "H、医学物理",
        "list": [{
                "sonTitle": "H1、X射线质控",
                "sonlist": [
                    "H1.1、X射线检测系统",
                    "H1.2、CT剂量模体",
                    "H1.3、CT性能模体",
                    "H1.4、乳腺性能质控模体",
                    "H1.5、牙科检测模体",
                    "H1.6、DSA性能检测模体",
                    "H1.7、NEMA IEC躯干模体",
                    "H1.8、剂量验证模体"
                ]
            },
            {
                "sonTitle": "H2、放疗质控设备",
                "sonlist": [
                    "H2.1、绝对剂量仪",
                    "H2.2、三维扫描水箱",
                    "H2.3、辅助设备",
                    "H2.4、仿真模体",
                    "H2.4、仿真模体",
                    "H2.6、γ刀模体"
                ]
            },
            {
                "sonTitle": "H3、核医学质控",
                "sonlist": [
                    "H3.1、放射性核素活度计",
                    "H3.2、SPECT性能检测模体",
                    "H3.3、PET性能检测模",
                    "H3.4、MRI检测模"
                ]
            }
        ]
    },
    {
        "title": "I、探测器和电子学",
        "list": [{
            "sonTitle": "I1、探测器和电子"
        }]
    },
    {
        "title": "J、自研集成、软件系统",
        "list": [{
                "sonTitle": "J1、ROMS100车载辐射监测管理系统"
            },
            {
                "sonTitle": "J2、ROMS200智能辐射监测管理系统"
            },
            {
                "sonTitle": "J3、ROMS300 辐射应急单兵组网系统"
            },
            {
                "sonTitle": "J4、ROMS310 辐射应急无人机监测系统"
            },
            {
                "sonTitle": "J5、ROMS400 放射性废物收贮车管理系统"
            },
            {
                "sonTitle": "J6、ROMS410 放射性废物库智能安防及收贮管理系统"
            },
            {
                "sonTitle": "J7、ROMS500 直流电合成场强监测系统"
            },
            {
                "sonTitle": "J8、ROMS600 仪器智能管理系统"
            },
            {
                "sonTitle": "J9、ROMS1000智能辐射自动站系统"
            },
            {
                "sonTitle": "J10、ROMS2000 辐射实验室LIMS系统"
            },
            {
                "sonTitle": "J11、ROMS3000重点风险源监管系统"
            },
            {
                "sonTitle": "J12、ROMS4000敏感物资管理系统"
            }
        ]
    }
]


let sql = `insert into category(id,title,sort,type,supId)
                values
                (?,?,?,?,?)`

async function init() {
    try {
        for (let i in arr) {
            let uuidOne = uuidv4();
            await db.query(sql, [uuidOne, arr[i].title, ++i, 1, null], 'queryById')
            let s = i - 1;
            for (let is in arr[s].list) {
                let uuidTwo = uuidv4();
                await db.query(sql, [uuidTwo, arr[s].list[is].sonTitle, ++is, 2, uuidOne], 'queryById')

            }
        }
    } catch (error) {
        console.error('error', error)
    }
    console.log('结束战斗')
}
init();