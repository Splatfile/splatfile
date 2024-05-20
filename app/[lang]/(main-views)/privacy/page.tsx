import React from "react";

const PrivacyPolicy = () => (
  <div className={"m-4 rounded-md bg-white"}>
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Privacy Policy</h1>
      <p className="mb-2">
        Splatfile is committed to protecting the privacy of its users and
        safeguarding their personal information.
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        Types of Personal Information Collected
      </h2>
      <ul className="mb-4 ml-8 list-disc">
        <li>Email, login ID, service usage records, access logs, etc.</li>
      </ul>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        Purpose of Collection and Use of Personal Information
      </h2>
      <p className="mb-4">
        Member management, service provision and improvement, development of new
        services, etc.
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        Retention and Use Period of Personal Information
      </h2>
      <p className="mb-4">
        Personal information is retained for as long as one remains a member
        using the service. Upon termination of the service agreement,
        information is immediately destroyed unless retention is required by
        relevant laws for a certain period.
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        Procedures and Methods for Destruction of Personal Information
      </h2>
      <p>
        Personal information stored in electronic file format is deleted using
        technical methods that make the records irrecoverable.
      </p>
    </div>
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">개인정보 처리방침</h1>
      <p className="mb-2">
        ‘스플랫 파일’은 이용자의 개인정보를 보호하며, 개인정보와 관련한 이용자의
        권리를 보호하기 위해 최선을 다합니다.
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        수집하는 개인정보 항목
      </h2>
      <ul className="mb-4 ml-8 list-disc">
        <li>이메일, 로그인 ID, 서비스 이용 기록, 접속 로그 등</li>
      </ul>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        개인정보의 수집 및 이용 목적
      </h2>
      <p className="mb-4">
        회원 관리, 서비스 제공 및 개선, 신규 서비스 개발 등
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        개인정보의 보유 및 이용 기간
      </h2>
      <p className="mb-4">
        이용자가 회원으로서 서비스를 이용하는 동안 보유. 이용 계약 해지 시 즉시
        파기, 단, 관련 법령에 의해 보존 필요성이 있는 경우 일정 기간 보관
      </p>
      <h2 className="mb-2 mt-4 text-xl font-semibold">
        개인정보의 파기 절차 및 방법
      </h2>
      <p>
        전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을
        사용하여 삭제합니다.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
