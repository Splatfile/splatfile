import { I18nVariables } from "@supabase/auth-ui-shared";

export const ko: I18nVariables = {
  sign_up: {
    email_label: "이메일 주소",
    password_label: "비밀번호 생성",
    email_input_placeholder: "이메일 주소를 입력하세요",
    password_input_placeholder: "비밀번호를 입력하세요",
    button_label: "가입하기",
    loading_button_label: "가입 중...",
    social_provider_text: "{{provider}}에 가입하기",
    link_text: "계정이 없으신가요? 가입하기",
    confirmation_text: "가입 확인 이메일을 보냈습니다.",
  },
  sign_in: {
    email_label: "이메일 주소",
    password_label: "비밀번호",
    email_input_placeholder: "이메일 주소를 입력하세요",
    password_input_placeholder: "비밀번호를 입력하세요",
    button_label: "로그인",
    loading_button_label: "로그인 중...",
    social_provider_text: "{{provider}}에 가입하기",
    link_text: "계정이 이미 있으신가요? 로그인",
  },
  magic_link: {
    email_input_label: "이메일 주소",
    email_input_placeholder: "이메일 주소를 입력하세요",
    button_label: "매직 링크 보내기",
    loading_button_label: "매직 링크 전송 중...",
    link_text: "매직 링크 이메일 보내기",
    confirmation_text: "매직 링크를 보냈습니다.",
  },
  forgotten_password: {
    email_label: "이메일 주소",
    password_label: "새로운 비밀번호",
    email_input_placeholder: "이메일 주소를 입력하세요",
    button_label: "비밀번호 재설정 안내 메일 보내기",
    loading_button_label: "재설정 안내 메일 전송 중...",
    link_text: "비밀번호를 잊으셨나요?",
    confirmation_text: "비밀번호 재설정 안내 메일을 보냈습니다.",
  },
  update_password: {
    password_label: "새로운 비밀번호",
    password_input_placeholder: "새로운 비밀번호를 입력하세요",
    button_label: "비밀번호 업데이트",
    loading_button_label: "비밀번호 업데이트 중...",
    confirmation_text: "비밀번호가 업데이트 되었습니다.",
  },
};
