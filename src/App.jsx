import { useEffect, useState } from "react";

const INITIAL_SECONDS = 20 * 60;

export default function ExpressiveWritingApp() {
  const [screen, setScreen] = useState("intro");
  const [currentDay, setCurrentDay] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false);
  const [responses, setResponses] = useState({});
  const [reflectionNotes, setReflectionNotes] = useState({});
  const [writingTexts, setWritingTexts] = useState({});
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");

  const days = [
    {
      day: 1,
      title: "첫째 날",
      focus: "사건과 감정 탐색",
      guide: [
        "당신 삶에 가장 큰 영향을 준 감정적 사건에 대해 써보세요.",
        "당시의 감정과 지금 떠오르는 감정을 모두 포함하세요.",
        "누구와 관련된 사건이었는지 자유롭게 탐색하세요.",
        "문법이나 형식은 신경 쓰지 마세요.",
        "20분 동안 멈추지 말고 계속 써보세요."
      ]
    },
    {
      day: 2,
      title: "둘째 날",
      focus: "삶의 패턴과 연결",
      guide: [
        "어린 시절, 가족, 관계 경험과 연결해보세요.",
        "이 사건이 현재 삶에 어떤 영향을 주는지 탐색하세요.",
        "반복되는 감정이나 패턴이 있었는지 생각해보세요.",
        "당신의 깊은 생각과 감정을 솔직하게 표현하세요.",
        "계속해서 흐름을 유지하며 써보세요."
      ]
    },
    {
      day: 3,
      title: "셋째 날",
      focus: "의미 재구성과 새로운 관점",
      guide: [
        "이 경험을 새로운 관점에서 바라보세요.",
        "무엇을 배웠고 무엇이 변했는지 탐색해보세요.",
        "당신의 현재 삶과 미래에 어떤 의미가 있는지 생각해보세요.",
        "감정뿐 아니라 통찰과 변화도 자유롭게 적어보세요.",
        "오늘도 20분 동안 계속 글을 이어가세요."
      ]
    },
    {
      day: 4,
      title: "넷째 날",
      focus: "통합과 미래 연결",
      guide: [
        "4일간의 글쓰기를 돌아보며 정리해보세요.",
        "당신은 무엇을 잃고 무엇을 얻었나요?",
        "앞으로 어떤 삶을 살아가고 싶은지 적어보세요.",
        "이 경험이 미래 행동과 생각에 어떤 영향을 줄지 탐색하세요.",
        "당신 자신에게 솔직하고 따뜻하게 글을 마무리해보세요."
      ]
    }
  ];

  const questions = [
    "오늘 나는 내 깊은 생각과 감정을 어느 정도 표현했는가?",
    "오늘 나는 슬픔·분노·불안을 어느 정도 느꼈는가?",
    "오늘 나는 안도감·해방감·평온함을 어느 정도 느꼈는가?",
    "오늘 글쓰기는 나에게 의미 있는 경험이었는가?"
  ];

  const current = days[currentDay - 1];

  useEffect(() => {
    const saved = localStorage.getItem("expressiveWriting4DayData");

    if (saved) {
      setHasSavedSession(true);
      try {
        const parsed = JSON.parse(saved);
        setScreen(parsed.screen || "intro");
        setCurrentDay(parsed.currentDay || 1);
        setResponses(parsed.responses || {});
        setReflectionNotes(parsed.reflectionNotes || {});
        setWritingTexts(parsed.writingTexts || {});
        setSecondsLeft(parsed.secondsLeft ?? INITIAL_SECONDS);
        setTimerStarted(false);
        setLastSavedAt(parsed.updatedAt || "");
      } catch (error) {
        console.error("저장된 데이터를 불러오지 못했습니다.", error);
      }
    }

    setHasLoadedSavedData(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedData) return;

    localStorage.setItem(
      "expressiveWriting4DayData",
      JSON.stringify({
        screen,
        currentDay,
        responses,
        reflectionNotes,
        writingTexts,
        secondsLeft,
        updatedAt: new Date().toISOString()
      })
    );
  }, [screen, currentDay, responses, reflectionNotes, writingTexts, secondsLeft, hasLoadedSavedData]);

  useEffect(() => {
    if (screen !== "writing" || !timerStarted || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, timerStarted, secondsLeft]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const startWriting = () => {
    if (!writingTexts[currentDay]) {
      setSecondsLeft(INITIAL_SECONDS);
    }
    setTimerStarted(false);
    setScreen("writing");
  };

  const goBack = () => {
    if (screen === "dayIntro") {
      if (currentDay > 1) {
        setCurrentDay((prev) => prev - 1);
        setScreen("writing");
      } else {
        setScreen("intro");
      }
    } else if (screen === "writing") {
      setScreen("dayIntro");
    } else if (screen === "pause") {
      setScreen("writing");
    } else if (screen === "reflection") {
      setScreen("pause");
    } else if (screen === "final") {
      setScreen("reflection");
    }
  };

  const BackButton = () => (
    <button
      onClick={goBack}
      aria-label="이전 화면으로 돌아가기"
      className="mb-6 inline-flex w-auto items-center gap-2 rounded-full border border-stone-300 px-5 py-2 text-stone-600 hover:bg-stone-100 transition self-start"
    >
      <span className="text-xl leading-none">←</span>
      <span className="text-sm">이전</span>
    </button>
  );

  const selectResponse = (day, questionIndex, score) => {
    setResponses((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [questionIndex]: score
      }
    }));
  };

  const getResponse = (day, questionIndex) => {
    return responses[day]?.[questionIndex];
  };

  const updateWritingText = (day, value) => {
    setWritingTexts((prev) => ({
      ...prev,
      [day]: value
    }));
  };

  const resetAllData = () => {
    const confirmed = window.confirm("저장된 모든 글쓰기 기록과 응답을 삭제할까요?");
    if (!confirmed) return;

    localStorage.removeItem("expressiveWriting4DayData");
    setScreen("intro");
    setCurrentDay(1);
    setResponses({});
    setReflectionNotes({});
    setWritingTexts({});
    setSecondsLeft(INITIAL_SECONDS);
    setTimerStarted(false);
    setHasSavedSession(false);
    setLastSavedAt("");
  };

  const getTotalCharacters = () => {
    return Object.values(writingTexts).reduce((total, text) => total + (text?.length || 0), 0);
  };

  const getCompletedWritingDays = () => {
    return days.filter((day) => (writingTexts[day.day] || "").trim().length > 0).length;
  };

  const getScore = (day, questionIndex) => {
    return responses[day]?.[questionIndex] ?? "-";
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {screen === "intro" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-200">
            <h1 className="text-4xl font-bold mb-4">4일 표현적 글쓰기 프로그램</h1>

            <p className="text-lg leading-relaxed text-stone-600 mb-6">
              이 프로그램은 4일 동안 하루 20분씩 자신의 감정과 경험을 깊이 탐색하는 자기성찰 기반 글쓰기 여정입니다.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h3 className="font-semibold mb-2">진행 원칙</h3>
                <ul className="text-sm space-y-1 text-stone-600">
                  <li>• 하루 20분 글쓰기</li>
                  <li>• 멈추지 말고 계속 쓰기</li>
                  <li>• 문법·형식 신경쓰지 않기</li>
                  <li>• 가능한 솔직하게 쓰기</li>
                </ul>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h3 className="font-semibold mb-2">개인정보</h3>
                <ul className="text-sm space-y-1 text-stone-600">
                  <li>• 서버 전송 없음</li>
                  <li>• 브라우저 로컬 저장</li>
                  <li>• 파일 다운로드 가능</li>
                  <li>• 언제든 삭제 가능</li>
                </ul>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h3 className="font-semibold mb-2">안내</h3>
                <ul className="text-sm space-y-1 text-stone-600">
                  <li>• 감정이 강해질 수 있습니다</li>
                  <li>• 필요하면 잠시 쉬어가세요</li>
                  <li>• 공용 PC 사용 후 기록 삭제 권장</li>
                </ul>
              </div>
            </div>

            {hasSavedSession && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 mb-6">
                <div className="font-semibold text-amber-900 mb-2">
                  이전 기록이 자동 복원되었습니다.
                </div>

                <div className="text-sm text-amber-800 leading-relaxed">
                  같은 PC와 같은 브라우저에서는 진행 상태와 글쓰기 내용이 자동 저장됩니다.

                  {lastSavedAt && (
                    <span className="block mt-2 text-amber-700">
                      마지막 저장 시각: {new Date(lastSavedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-8">
              <h3 className="font-semibold text-lg mb-3">시작 전 확인</h3>
              <p className="text-stone-600 leading-relaxed mb-3">
                글쓰기는 자신을 평가하거나 잘 쓰기 위한 시간이 아닙니다. 지금 떠오르는 생각과 감정을 있는 그대로 적어보는 시간입니다.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                같은 PC와 같은 브라우저로 다시 접속하면 이전 진행 상태와 작성 내용이 자동으로 복원됩니다.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 mb-8 text-sm text-stone-500 leading-relaxed">
              <p className="mb-2">
                이 프로그램은 James W. Pennebaker와 John F. Evans의 표현적 글쓰기(expressive writing) 접근을 웹 환경으로 구현한 자기성찰 글쓰기 도구입니다.
              </p>
              <p>구성 및 웹 구현: 최규하</p>
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <button
                onClick={resetAllData}
                className="px-6 py-4 rounded-2xl bg-stone-100 text-stone-600 text-lg hover:bg-stone-200 transition"
              >
                기록 초기화
              </button>

              <button
                onClick={() => setScreen("dayIntro")}
                className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition"
              >
                준비되셨나요?
              </button>
            </div>
          </div>
        )}

        {screen === "dayIntro" && (
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 min-h-[680px] flex flex-col justify-between">
            <div>
              <BackButton />

              <div className="text-sm tracking-[0.3em] uppercase text-stone-400 mb-6">
                Day {current.day}
              </div>

              <h2 className="text-5xl font-bold mb-5">{current.title}</h2>
              <p className="text-2xl text-stone-600 mb-10">{current.focus}</p>

              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200">
                <h3 className="text-xl font-semibold mb-6">오늘의 글쓰기 안내</h3>
                <div className="space-y-5 text-lg leading-relaxed text-stone-700">
                  {current.guide.map((g, idx) => (
                    <p key={idx}>• {g}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-10">
              <button
                onClick={startWriting}
                className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition"
              >
                글쓰기 시작
              </button>
            </div>
          </div>
        )}

        {screen === "writing" && (
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 min-h-[760px] flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <BackButton />
                <div className="text-sm tracking-[0.3em] uppercase text-stone-400 mb-3">
                  Day {current.day}
                </div>
                <h2 className="text-3xl font-bold">{current.title}</h2>
              </div>

              <div className="bg-stone-100 rounded-3xl px-6 py-4 text-center min-w-[140px]">
                <div className="text-sm text-stone-500 mb-1">
                  {timerStarted ? "남은 시간" : "권장 시간"}
                </div>
                <div className="text-3xl font-bold">{formatTime(secondsLeft)}</div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">글쓰기 안내</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-stone-700 leading-relaxed">
                {current.guide.map((g, idx) => (
                  <p key={idx}>• {g}</p>
                ))}
              </div>
            </div>

            <textarea
              value={writingTexts[currentDay] || ""}
              onChange={(event) => {
                updateWritingText(currentDay, event.target.value);
                if (!timerStarted) setTimerStarted(true);
              }}
              placeholder="지금 떠오르는 생각과 감정을 자유롭게 적어보세요..."
              className="flex-1 min-h-[420px] rounded-3xl border border-stone-200 bg-stone-50 p-8 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
            />

            <div className="flex items-center justify-between pt-8">
              <div className="text-sm text-stone-400">
                입력 내용은 이 브라우저에 자동 저장됩니다. 첫 글자를 입력하면 20분 타이머가 시작됩니다.
              </div>

              <button
                onClick={() => setScreen("pause")}
                className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition"
              >
                글쓰기 마치기
              </button>
            </div>
          </div>
        )}

        {screen === "pause" && (
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 min-h-[680px] flex flex-col">
            <BackButton />
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="max-w-xl">
                <div className="text-sm tracking-[0.3em] uppercase text-stone-400 mb-6">
                  Pause
                </div>

                <h2 className="text-5xl font-bold leading-tight mb-8">
                  잠시 숨을 고르세요.
                </h2>

                <p className="text-xl leading-relaxed text-stone-600 mb-16">
                  지금 느껴지는 감정과 몸의 상태를 천천히 바라보세요. 서두르지 않아도 괜찮습니다.
                </p>

                <button
                  onClick={() => setScreen("reflection")}
                  className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition"
                >
                  자기평가 이어가기
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "reflection" && (
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 min-h-[680px] flex flex-col justify-between">
            <div>
              <BackButton />

              <div className="text-sm tracking-[0.3em] uppercase text-stone-400 mb-6">
                Reflection
              </div>

              <h2 className="text-4xl font-bold mb-4">오늘의 경험을 돌아보세요.</h2>
              <p className="text-lg text-stone-600 mb-10 leading-relaxed">
                방금의 글쓰기 경험을 천천히 떠올리며 자신의 상태를 체크해보세요.
              </p>

              <div className="space-y-10">
                {questions.map((q, idx) => (
                  <div key={idx}>
                    <div className="mb-4 text-lg font-medium leading-relaxed">{q}</div>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from({ length: 11 }).map((_, score) => {
                        const selected = getResponse(currentDay, idx) === score;

                        return (
                          <button
                            key={score}
                            onClick={() => selectResponse(currentDay, idx, score)}
                            className={`w-11 h-11 rounded-full border transition ${
                              selected
                                ? "bg-stone-900 text-white border-stone-900"
                                : "border-stone-300 hover:bg-stone-900 hover:text-white"
                            }`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="mb-4 text-lg font-medium">
                    오늘 특별히 떠오른 점이나 변화가 있다면 자유롭게 적어보세요.
                  </div>

                  <textarea
                    value={reflectionNotes[currentDay] || ""}
                    onChange={(event) =>
                      setReflectionNotes((prev) => ({
                        ...prev,
                        [currentDay]: event.target.value
                      }))
                    }
                    placeholder="오늘의 통찰이나 변화, 인상 깊었던 점을 적어보세요..."
                    className="w-full min-h-[160px] rounded-3xl border border-stone-200 bg-stone-50 p-6 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-10">
              <button
                onClick={() => {
                  if (currentDay < 4) {
                    setCurrentDay(currentDay + 1);
                    setScreen("dayIntro");
                  } else {
                    setScreen("final");
                  }
                }}
                className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition"
              >
                {currentDay < 4 ? "다음 날 이어가기" : "마무리 보기"}
              </button>
            </div>
          </div>
        )}

        {screen === "final" && (
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 min-h-[680px] flex flex-col justify-between">
            <div>
              <BackButton />

              <div className="text-sm tracking-[0.3em] uppercase text-stone-400 mb-6">
                Final Reflection
              </div>

              <h2 className="text-5xl font-bold leading-tight mb-8">
                4일간의 글쓰기 여정을 마쳤습니다.
              </h2>

              <p className="text-xl leading-relaxed text-stone-600 mb-12">
                가능하다면 2~3일 정도 충분히 쉬어간 뒤, 다시 자신의 글을 천천히 읽어보는 시간을 가져보세요.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
                  <h3 className="text-xl font-semibold mb-4">감정 변화 흐름</h3>

                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day.day} className="rounded-2xl bg-white border border-stone-200 p-4">
                        <div className="font-semibold mb-3">Day {day.day}</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-stone-600">
                          <div>표현 정도: {getScore(day.day, 0)}</div>
                          <div>슬픔·분노·불안: {getScore(day.day, 1)}</div>
                          <div>안도·평온: {getScore(day.day, 2)}</div>
                          <div>의미 경험: {getScore(day.day, 3)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
                  <h3 className="text-xl font-semibold mb-4">글쓰기 통계</h3>
                  <div className="space-y-4 text-lg text-stone-700">
                    <div className="flex justify-between">
                      <span>작성한 일차</span>
                      <span>{getCompletedWritingDays()} / 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 권장 시간</span>
                      <span>80분</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 글자 수</span>
                      <span>{getTotalCharacters().toLocaleString()} 자</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h4 className="font-semibold text-stone-800">Day별 글자 수</h4>
                    {days.map((day) => (
                      <div key={day.day} className="flex justify-between text-stone-600">
                        <span>Day {day.day}</span>
                        <span>{(writingTexts[day.day]?.length || 0).toLocaleString()} 자</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 mb-10">
                <h3 className="text-xl font-semibold mb-5">마지막 자기성찰 메모</h3>
                <div className="space-y-4">
                  {days.map((day) => (
                    <div key={day.day} className="rounded-2xl bg-white border border-stone-200 p-4">
                      <div className="font-semibold mb-2">Day {day.day}</div>
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {reflectionNotes[day.day]?.trim() || "아직 작성된 메모가 없습니다."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 leading-relaxed text-stone-700 text-lg">
                당신이 경험한 감정과 생각은 당신 삶의 중요한 일부입니다. 이 과정은 자신을 이해하고 정리하는 하나의 여정일 뿐이며, 스스로를 비난하기보다 이해하려는 태도가 중요합니다.
              </div>
            </div>

            <div className="flex justify-end pt-10">
              <button className="px-8 py-4 rounded-2xl bg-stone-900 text-white text-lg hover:bg-stone-700 transition">
                기록 다운로드
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
