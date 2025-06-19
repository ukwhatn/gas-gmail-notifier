/**
 * メール受信時にDiscordにWebhookを送信するスクリプト
 *
 * @author ukwhatn <ukwhatn@gmail.com>
 */

// フラグ用ラベル名
// このラベルが付いたメールを通知対象から除外する（ステート管理用）
const NOTIFICATION_LABEL = '通知済';

// 通知先Webhook URL
// スクリプトプロパティに"WEBHOOK_URL"を設定しておくこと
const getWebhookUrl = () => {
  return PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL');
}

// Webhookを送信する関数
// Discord向けにしているが、大抵動くはず
const sendWebhook = (
  url: string,
  payload: any
) => {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

// フラグ用ラベルを取得する関数
// ラベルが存在しない場合は作成する
const getNotificationLabel = () => {
  // フラグ用ラベルが存在しない場合は作成
  const label = GmailApp.getUserLabelByName(NOTIFICATION_LABEL);
  if (!label) {
    return GmailApp.createLabel(NOTIFICATION_LABEL);
  }
  return label;
}

// 通知対象メールを取得する関数
// フラグ用ラベルが付いていないメールを取得する
const searchTargetMails = () => {
  // 直近1日間の未通知メールを取得（ここは適宜変えるべき）
  const query = `-from:me label:inbox -label:${NOTIFICATION_LABEL} after:${Utilities.formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000), Session.getScriptTimeZone(), 'yyyy/MM/dd')}`;
  const threads = GmailApp.search(query);
  // 各スレッドの最新のメッセージを取得
  return threads.map((thread) => {
    const messages = thread.getMessages();
    return messages[messages.length - 1];
  })
}

// メイン関数
(global as any).main = () => {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    console.error('WEBHOOK_URLが設定されていません');
    return;
  }

  // ラベル存在確認
  const notificationLabel = getNotificationLabel();
  if (!notificationLabel) {
    console.error('フラグ用ラベルが存在しません');
    return;
  }
  
  const targetMails = searchTargetMails();

  targetMails.forEach((mail) => {
      const rawFrom = mail.getFrom();

      // rawFromが xxx <yyy@zzz> の形であれば、名前とメールアドレスに分離
      const fromMatch = rawFrom.match(/(.+) <(.+)>/);
      let fromName, fromEmail;
      if (fromMatch !== null) {
        fromName = fromMatch[1];
        fromEmail = fromMatch[2];
      } else {
        fromName = '不明な送信者';
        fromEmail = rawFrom;
      }

      const subject = mail.getSubject();
      const date = mail.getDate();

      const payload = {
        username: "メール通知",
        content: ":mailbox: **メールを受信しました**",
        embeds: [
          {
            title: subject,
            timestamp: date,
            color: 14423100,
            author: {
              name: fromName,
            },
            fields: [
              {
                name: "送信者",
                value: fromEmail,
              }
            ],
          }
        ]
      };

      sendWebhook(webhookUrl, payload);

      // フラグ用ラベルを付与
      mail.getThread().addLabel(getNotificationLabel());
    }
  );
}