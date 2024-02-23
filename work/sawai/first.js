function 青を検知() {
    if (色 == 4) {
        カラーマーカー = 3
    }
    basic.showLeds(`
        . # . . .
        . # . . .
        . # # # .
        . # . # .
        . # # # .
        `)
}
function カラーセンサーの初期化() {
    pins.i2cWriteNumber(
        42,
        138,
        NumberFormat.UInt16BE,
        false
    )
    pins.i2cWriteNumber(
        42,
        10,
        NumberFormat.UInt16BE,
        false
    )
}
// 0:白、1:黒、2:赤、3:緑、4:青,5
function 色をしらべる() {
    tmp = 0
    tmp = (rg + gg + bg) / 3
    if (最大あかるさ < tmp) {
        最大あかるさ = tmp
    }
    if (tmp > 最大あかるさ * 0.5 && Math.abs((rg - bg) / (rg + bg)) < 0.15 && (Math.abs((rg - gg) / (rg + gg)) < 0.15 && Math.abs((gg - bg) / (gg + bg)) < 0.15)) {
        仮色 = 0
    } else if (tmp < 最大あかるさ * 0.5 && Math.abs((rg - bg) / (rg + bg)) < 0.15 && (Math.abs((rg - gg) / (rg + gg)) < 0.15 && Math.abs((gg - bg) / (gg + bg)) < 0.15)) {
        仮色 = 1
    } else if (rg > gg && rg > bg) {
        // red
        仮色 = 2
    } else if (gg > rg && gg > bg) {
        // green
        仮色 = 3
    } else if (bg > rg && bg > gg) {
        if (bg > rg) {
            // brue
            仮色 = 4
        } else {
            仮色 = 5
        }
    } else {

    }
    前色 = 仮色
    if (仮色 == 前色) {
        色 = 仮色
    }
    serial.writeValue("rg", rg)
    serial.writeValue("gg", gg)
    serial.writeValue("bg", bg)
    serial.writeValue("c", 色)
    serial.writeValue("m", 最大あかるさ)
    serial.writeValue("t", tmp)
}
input.onButtonPressed(Button.A, function () {
    ライントレースの開始()
})
function 追従と回避() {
    // 障害物がある場合
    if (maqueen.Ultrasonic(PingUnit.Centimeters) > 10) {
        トレース()
    } else {
        maqueen.motorStop(maqueen.Motors.All)
        // 右に回避
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 130)
        basic.pause(200)
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 100)
        basic.pause(300)
        // 左に戻る
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 100)
        basic.pause(300)
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 100)
        basic.pause(200)
    }
}
IR.IR_callbackUser(function (message) {
    volue = message
    whaleysans.showNumber(volue)
    serial.writeLine("" + (volue))
    if (message == 70) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 200)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 200)
    }
    if (message == 21) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 200)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 200)
    }
    if (message == 68) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 25)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 200)
    }
    if (message == 67) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 200)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 25)
    }
    if (message == 64) {
        maqueen.motorStop(maqueen.Motors.All)
    }
    if (message == 22) {
        maqueen.servoRun(maqueen.Servos.S1, 95)
        maqueen.servoRun(maqueen.Servos.S2, 95)
    }
    if (message == 7) {
        maqueen.servoRun(maqueen.Servos.S1, 135)
        maqueen.servoRun(maqueen.Servos.S2, 135)
    }
})
function 赤を検知() {
    if (色 == 2) {
        カラーマーカー = 1
    }
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . . .
        . # . . .
        . # . . .
        `)
}
input.onButtonPressed(Button.B, function () {
    basic.showString("A")
    if (トレースモード == 0) {
        トレースモード = 1
        basic.showString("T")
    } else {
        トレースモード = 0
        basic.clearScreen()
    }
})
function 色をすいとる() {
    pins.i2cWriteNumber(
        42,
        3,
        NumberFormat.UInt8BE,
        true
    )
    r = pins.i2cReadNumber(42, NumberFormat.UInt16BE, false)
    pins.i2cWriteNumber(
        42,
        5,
        NumberFormat.UInt8BE,
        true
    )
    g = pins.i2cReadNumber(42, NumberFormat.UInt16BE, false)
    pins.i2cWriteNumber(
        42,
        7,
        NumberFormat.UInt8BE,
        true
    )
    b = pins.i2cReadNumber(42, NumberFormat.UInt16BE, false)
    if (g != 0) {
        rg = r / 1000 * 255 * coeff
        gg = g / 1000 * 255 * 1
        bg = b / 1000 * 255 * coeff
    } else {
        rg = 0
        gg = 0
        bg = 0
    }
    if (rg >= 256) {
        rg = 255
    }
    if (gg >= 256) {
        gg = 255
    }
    if (bg >= 256) {
        bg = 255
    }
    rg = Math.trunc(rg)
    gg = Math.trunc(gg)
    bg = Math.trunc(bg)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {

})
function トレース2() {
    if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 50)
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 0 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 0)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 40)
    } else {
        maqueen.motorStop(maqueen.Motors.All)
    }
}
function ライントレースの開始() {
    トレースモード = 1
}
function トレース() {
    if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 41)
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 0 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 0)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 40)
    } else {
        maqueen.motorStop(maqueen.Motors.All)
    }
}
let b = 0
let g = 0
let r = 0
let volue = 0
let bg = 0
let gg = 0
let rg = 0
let tmp = 0
let カラーマーカー = 0
let トレースモード = 0
let 最大あかるさ = 0
let 仮色 = 0
let 前色 = 0
let 色 = 0
let coeff = 0
// 後日別変数になるように
coeff = 11 / 7
色 = -1
前色 = -1
仮色 = -1
最大あかるさ = 50
トレースモード = 0
maqueen.motorStop(maqueen.Motors.All)
basic.forever(function () {
    赤を検知()
    if (カラーマーカー == 1) {
        maqueen.motorStop(maqueen.Motors.All)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
    青を検知()
    if (カラーマーカー == 3) {
        maqueen.motorStop(maqueen.Motors.All)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
})
