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
const first_date = new Date(2025, (designated_month - 1), 1);

// オプションの引数が1〜12に当てはまらない場合はエラーを発生させる
if (designated_month > 12 || designated_month < 1) {
  throw new Error("オプションの数値が正しくありません。1〜12の数字で指定してください。");
}

// 月名を英名で表示するための配列
const month_english_list = ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];
const month_english = month_english_list[designated_month - 1];

// 初日の前に挿入するスペースの数を各月の1日目の曜日をベースに決定する。曜日ごとに半角スペース3つずつずれる
function check_first_date3(i) {
  return "   ".repeat(i.getDay());
}

// 引数から得た月の最終日を取得する
const getLastDayMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

// 初日から最終日までの日付を配列に入れて1ヶ月間の日付を作る。引数に月の最終日を入れる
function make_dates(m) {
  let dates = [];
  for (let i = 1; i <= m; i++ ) {
    dates.push(i);
  }
  return dates;
}

// 日付の出力。1桁であれば頭に半角スペースを補う。出力する日付の曜日が土曜日(6)ならば改行、違えば日付の後ろに半角スペース出力
function output_dates2(dates) {
  for (let i = 0; i < dates.length; i++ ) {
    process.stdout.write(String(dates[i]).padStart(2, " "));
    let date = new Date(2025, designated_month - 1, dates[i]);
    if (date.getDay() !== 6) {
      process.stdout.write(" ");
    } else {
      process.stdout.write("\n");
    }
  }
}

console.log("  ", month_english, String(now.getFullYear()));
console.log("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
// 1日目を出力する前に挿入するスペース
const first_date_space = check_first_date3(first_date);
// 該当月の最終日
const last_date = getLastDayMonth(2025, designated_month);
//生成した月内全ての日付
const all_dates = make_dates(last_date);
process.stdout.write(first_date_space);
output_dates2(all_dates);
// 出力の末尾に % が入ってしまうので、改行をすることで出力されないようにする
process.stdout.write("\n");