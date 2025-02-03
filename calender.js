// 引数からオプションを拾えるように設定
import { parseArgs } from "node:util";

// オプションの設定。文字列型、短縮系は「m」、同じオプションは２回以上追加えない
const options = {
  "month": {
    type: "string",
    short: "m",
    multiple: false,
  },
};

// 現在時刻を取得する
const now = new Date();
// process.argvの0番目にはnodeへのpath、1番目にはファイルへのpathが入っていて不要なのでsliceで2番目から取得するようフィルター
const args = process.argv.slice(2);
const parsedArgs = parseArgs({options, args});
// 引数からオプションとして取得した月を数値型に変換して変数へ代入する。オプションの指定が無い場合は現時点の月を代わりに代入。
const designated_month = Number(parsedArgs.values.month) || (now.getMonth() + 1);

// オプションの引数が1〜12に当てはまらない場合はエラーを発生させる
if (designated_month > 12 || designated_month < 1) {
  throw new Error("オプションの数値が正しくありません。1〜12の数字で指定してください。");
}

// 月名を英名で表示するための配列
const month_english_list = ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];
const month_english = month_english_list[designated_month - 1];

// 最初に改行する場所を指定する
const turn = first_turn_place(designated_month);

// 月毎に1日目の前に挿入するスペースの数を決定する
function check_first_date(i) {
  if (i === 1 || i === 10) {
    // 半角スペースが9個
    return " ".repeat(9);
  } else if (i === 2 || i === 3 || i === 11) {
    // 半角スペースが18個
    return " ".repeat(18);
  } else if (i === 5) {
    // 半角スペースが12個
    return " ".repeat(12);
  } else if (i === 4 || i === 7) {
    // 半角スペースが6個
    return " ".repeat(6);
  } else if (i === 8) {
    // 半角スペースが15個
    return " ".repeat(15);
  } else if (i === 9 || i === 12) {
    // 半角スペースが3個
    return " ".repeat(3);
  } else {
    // 半角スペースが0個
    return "";
  }
}

// 月毎に1回目の改行をどこで挿入するかを決定する
function first_turn_place(i) {
  if (i === 1 || i === 10) {
    return 3;
  } else if (i === 2 || i === 3 || i === 11) {
    return 0;
  } else if (i === 4 || i === 7) {
    return 4;
  } else if (i === 5) {
    return 2;
  } else if (i === 8) {
    return 1;
  } else if (i === 9 || i === 12) {
    return 5;
  } else {
    return 6;
  }
}

// 月毎に最終日の日付を決定する
function check_last_date(n) {
  if (n === 2) {
    return 28;
  } else if (n === 4 || n === 6 || n === 9 || n === 11) {
    return 30;
  } else {
    return 31;
  };
}

// 初日から最終日までの日付を配列に入れて1ヶ月間の日付を作る。引数に月の最終日を入れる
function make_dates(m) {
  let dates = [];
  for (let i = 1; i <= m; i++ ) {
    dates.push(i);
  }
  return dates;
}

// 改行場所を１回目から４回目まで確認する。最初の改行箇所(turn)から7個✖️n(0〜4)が改行場所となる。改行する場合はbreakでfor文を抜ける
function times(number) {
  for (let t = 0; t < 5; t++) {
    if (turn + 7 * t === number) {
      process.stdout.write("\n");
      break;
    }
  }
}

// 配列に入った日付のデータを出力する。process.stdout.writeは改行無しで出力できるが、引数は文字列限定となる。
function output_dates(dates) {
  // 最初の改行場所を定義
  for (let i = 0; i < dates.length; i++ ) {
    // 日付が1桁で且つ9日ではない場合
    if (String(dates[i]).length === 1 && dates[i] !== 9) {
      process.stdout.write(" " + String(dates[i]) + " "); 
      times(i);
    // 日付が2桁で且つ月曜日の場合は頭のスペースを入れない
    } else if (String(dates[i]).length === 2 && (turn + 8 === i || turn + 15 === i || turn + 22 === i || turn + 29 === i) ) {
      process.stdout.write(String(dates[i]));
      times(i);
    // 日付が9日、若しくは2桁の場合は頭にスペースを入れる
    } else {
      process.stdout.write(" " + String(dates[i]));
      times(i);
    }
  }
}

console.log("  ", month_english, String(now.getFullYear()));
console.log("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
// 1日目を出力する前に挿入するスペース
const first_date_space = check_first_date(designated_month);
// 該当月の最終日
const last_date = check_last_date(designated_month);
//生成した月内全ての日付
const all_dates = make_dates(last_date);
process.stdout.write(first_date_space);
output_dates(all_dates);
// 出力の末尾に % が入ってしまうので、改行をすることで出力されないようにする
process.stdout.write("\n");
