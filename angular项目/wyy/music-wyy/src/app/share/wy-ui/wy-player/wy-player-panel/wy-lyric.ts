import {Lyric} from '../../../../servers/data-types/common.types';
import {from, Subject, Subscription, timer, zip} from 'rxjs';
import {skip} from 'rxjs/operators';

// [00:34.940]  [00:34] [0:34]
// const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
// const timeExp = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/;
const timeExp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/;

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

export interface LyricLine extends BaseLyricLine {
  time: number;
}

export interface Handler extends BaseLyricLine {
  lineNum: number;
}

export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];

  private playing = false;
  private curNum: number;
  private startStamp: number;
  private pauseStamp: number;

  private timer$: Subscription;

  handler = new Subject<Handler>();

  constructor(lyc: Lyric) {
    // console.log('lyc:', lyc);
    this.lrc = lyc;
    this.init();
  }

  private init() {
    if (this.lrc.tlyric) {
      this.genreTLyric();
    } else {
      this.genreLyric();
    }
  }

  private genreLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
    // console.log('lines:', lines);
  }

  private genreTLyric() {
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) != null);
    // console.log('lines:', lines);
    // console.log('tlines:', tlines);
    const moreLine = lines.length - tlines.length;

    let tempArr = [];
    if (moreLine >= 0) {
      tempArr = [lines, tlines];
    } else {
      tempArr = [tlines, lines];
    }

    const first = timeExp.exec(tempArr[1][0])[0];
    // console.log('first:', first);

    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec) {
        return exec[0] === first;
      }
    });

    const _skip = skipIndex === -1 ? 0 : skipIndex;
    const skipItems = tempArr[0].splice(0, _skip);
    if (skipItems.length) {
      skipItems.forEach(line => this.makeLine(line));
    }

    let zipLines$;
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
    } else {
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
    }
    zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));
  }

  private makeLine(line: string, tline = '') {
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
      if (txt) {
        const thirdResult = result[3] || '00';
        const len = thirdResult.length;
        const _thirdResult = len > 2 ? parseInt(thirdResult, 10) : parseInt(thirdResult, 10) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
        this.lines.push({ txt, txtCn, time });
      }
    }
    // console.log(result);
  }

  play(starTime = 0, vault = false) {
    if (!this.lines.length) { return; }
    if (!this.playing) {
      this.playing = true;
    }

    this.curNum = this.findCurNum(starTime);
    // console.log('curNum:', this.curNum);
    this.startStamp = Date.now() - starTime;

    if (!vault) {
      this.callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length) {
      // clearTimeout(this.timer);
      this.clearTimer();
      this.playReset();
    }
  }

  private clearTimer() {
    this.timer$ && this.timer$.unsubscribe();
  }

  private findCurNum(time: number): number {
    const index = this.lines.findIndex(item => time <= item.time);
    return index === -1 ? this.lines.length - 1 : index;
  }

  private playReset() {
    const line = this.lines[this.curNum];
    const delay = line.time - (Date.now() - this.startStamp);
    // this.timer = setTimeout(() => {
    //   this.callHandler(this.curNum++);
    //   if (this.curNum < this.lines.length && this.playing) {
    //     this.playReset();
    //   }
    // }, delay);
    this.timer$ = timer(delay).subscribe(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing) {
        this.playReset();
      }
    });
  }

  private callHandler(i: number) {
   if (i > 0) {
     this.handler.next({
       txt: this.lines[1].txt,
       txtCn: this.lines[1].txtCn,
       lineNum: i
     });
   }
  }

  togglePlay(playing: boolean) {
    const now = Date.now();
    this.playing = playing;
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime, true);
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }

  stop() {
    if (this.playing) {
      this.playing = false;
    }
    // clearTimeout(this.timer);
    this.clearTimer();
  }

  seek(time: number) {
    this.play(time);
  }
}
