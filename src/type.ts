import DigItems from './assets/digItem.json'
export const digItems:DigItem[] = DigItems
export enum StoneType {
    empty = 0,
    fissureMud = 1,
    mud = 2,
    fissureStone = 4,
    stone = 6,
    hardStone = 8,
    largeStone = 10,
}

export enum DigTool {
    shovel = 1,
    pickaxe = 2
}

export interface DigItem {
    id:string,
    name: string,
    score: number
    x?: number,
    y?: number
    number?: number
}

export interface MStats {
    isCanDig: boolean,
    isFindItem: boolean,
}

export class DigMine {
    grid: StoneType[][]
    item: {
        id:string,
        name: string,
        score: number,
        x: number,
        y: number
    }
    constructor(digData?: DigMine) {
        const allType = Object.keys(StoneType).filter(k => typeof StoneType[k as any] === "number")
        const randomType = allType.filter(k => StoneType[k as keyof typeof StoneType] >= StoneType.mud && StoneType[k as keyof typeof StoneType] <= StoneType.largeStone)
        if (!digData) {
            this.grid = Array(13).fill(0).map(() => Array(10).fill(0).map(() => StoneType[randomType[Math.floor(Math.random() * randomType.length)]]))
            const itemX = Math.floor(Math.random() * 13)
            const itemY = Math.floor(Math.random() * 10)
            const item = digItems[Math.floor(Math.random() * digItems.length)]
            this.item = { id:item.id,name: item.name, score: item.score, x: itemX, y: itemY }
        } else {
            this.grid = digData.grid
            this.item = digData.item
        }
    }
    dig(x: number, y: number, tool: DigTool) {
        let stats:MStats= { isCanDig: true, isFindItem: false }
        if (tool === DigTool.shovel && this.grid[x][y] > 3) {
           return  { isCanDig: false, isFindItem: false }
        }
        if (x < 0 || x >= 13 || y < 0 || y >= 10) {
            return { isCanDig: false, isFindItem: false }
        }
        if (this.grid[x][y] === 0) {
            return { isCanDig: false, isFindItem: false }
        }
        this.grid[x][y] -= tool
        this.grid[x][y]=this.grid[x][y]<0?0:this.grid[x][y]
        const spot = this.grid[x][y]
        if (x === this.item.x && y === this.item.y && spot == 0) {
            stats= { isCanDig: true, isFindItem: true }
        }
        if (tool === DigTool.pickaxe) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dy === 0&&dx === 0) {
                        continue
                    }
                    let nx = x + dx
                    let ny = y + dy
                    if (nx < 0 || nx >= 13 || ny < 0 || ny >= 10) {
                        continue
                    }
                    if (this.grid[nx][ny] <= 0) {
                        continue
                    }
                    this.grid[nx][ny] -= 1
                    if(this.grid[nx][ny] > StoneType.mud){
                    this.grid[nx][ny] -= 1
                    }
                    if (nx === this.item.x && ny === this.item.y && this.grid[nx][ny] === 0) {
                        stats= { isCanDig: true, isFindItem: true }
                    }
                }
            }
        }
        return stats
    }
}