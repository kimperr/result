package com.kimperr.kiamaker.nativeapp

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Spinner
import android.widget.TextView
import java.io.BufferedInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.DataOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID
import kotlin.concurrent.thread

private const val PICK_VIDEO_REQUEST = 4024
private const val GITHUB_ASSET_BASE = "https://raw.githubusercontent.com/kimperr/result/main"
private const val DEFAULT_SERVER_URL = "https://performing-flip-inflation-galaxy.trycloudflare.com"

class MainActivity : Activity() {
    private val state = MakerState()
    private lateinit var posterView: PosterView
    private lateinit var formContent: LinearLayout
    private lateinit var statusText: TextView
    private var selectedVideoUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildUi())
        loadPlayerImage()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == PICK_VIDEO_REQUEST && resultCode == RESULT_OK) {
            selectedVideoUri = data?.data
            status("영상 선택 완료")
        }
    }

    private fun buildUi(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(18, 18, 18))
        }

        val tabs = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(10), dp(10), dp(10), dp(6))
        }
        listOf(
            "라인업" to MakerMode.LINEUP,
            "경기결과" to MakerMode.RESULT,
            "영상" to MakerMode.VIDEO,
            "등말소" to MakerMode.ROSTER
        ).forEach { (label, mode) ->
            tabs.addView(Button(this).apply {
                text = label
                setOnClickListener {
                    state.mode = mode
                    updateFieldVisibility()
                    posterView.invalidate()
                }
            }, LinearLayout.LayoutParams(0, dp(44), 1f))
        }
        root.addView(tabs)

        val scroll = ScrollView(this)
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(8), dp(14), dp(16))
        }
        formContent = content
        scroll.addView(content)
        root.addView(scroll, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f))

        posterView = PosterView(this, state).apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(500))
        }
        content.addView(posterView)

        content.addView(spinner("선수 선택", PLAYER_OPTIONS.map { it.name }) { index ->
            state.playerName = PLAYER_OPTIONS[index].name
            state.playerNumber = PLAYER_OPTIONS[index].number
            loadPlayerImage()
            posterView.invalidate()
        })
        content.addView(spinner("상대팀", TEAM_OPTIONS.map { it.name }) { index ->
            state.teamCode = TEAM_OPTIONS[index].code
            state.opponentText = "vs ${TEAM_OPTIONS[index].name} · ${TEAM_OPTIONS[index].stadium}"
            posterView.invalidate()
        })

        content.addView(input("선수 이름", state.playerName) {
            state.playerName = it
            state.playerNumber = playerNumber(it)
            loadPlayerImage()
            posterView.invalidate()
        })
        content.addView(input("제목", state.title) {
            state.title = it
            posterView.invalidate()
        })
        content.addView(input("내용", state.meta) {
            state.meta = it
            posterView.invalidate()
        })
        content.addView(input("날짜", state.dateText) {
            state.dateText = it
            posterView.invalidate()
        })
        content.addView(input("상대/구장", state.opponentText) {
            state.opponentText = it
            posterView.invalidate()
        })
        content.addView(input("영상 서버", state.serverUrl) {
            state.serverUrl = it.trim()
        })

        content.addView(input("스코어", "${state.awayScore}:${state.homeScore}") {
            val parts = it.split(":", "-", " ")
            if (parts.size >= 2) {
                state.awayScore = parts[0].trim().ifBlank { state.awayScore }
                state.homeScore = parts[1].trim().ifBlank { state.homeScore }
                posterView.invalidate()
            }
        })
        content.addView(input("승/패/세이브", "${state.winnerName}/${state.loserName}/${state.saveName}") {
            val parts = it.split("/")
            if (parts.isNotEmpty()) state.winnerName = parts[0].trim()
            if (parts.size > 1) state.loserName = parts[1].trim()
            if (parts.size > 2) state.saveName = parts[2].trim()
            posterView.invalidate()
        })
        content.addView(input("라인업", state.lineupText) {
            state.lineupText = it
            posterView.invalidate()
        })
        content.addView(input("콜업", state.callUpText) {
            state.callUpText = it
            posterView.invalidate()
        })
        content.addView(input("말소", state.sendDownText) {
            state.sendDownText = it
            posterView.invalidate()
        })

        val actions = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        actions.addView(Button(this).apply {
            text = "PNG 저장"
            setOnClickListener { savePosterPng() }
        }, LinearLayout.LayoutParams(0, dp(48), 1f))
        actions.addView(Button(this).apply {
            text = "영상 선택"
            setOnClickListener { pickVideo() }
        }, LinearLayout.LayoutParams(0, dp(48), 1f))
        actions.addView(Button(this).apply {
            text = "영상 렌더"
            setOnClickListener { renderVideo() }
        }, LinearLayout.LayoutParams(0, dp(48), 1f))
        content.addView(actions)

        statusText = TextView(this).apply {
            setTextColor(Color.WHITE)
            textSize = 14f
            setPadding(0, dp(10), 0, 0)
        }
        content.addView(statusText)

        updateFieldVisibility()
        return root
    }

    private fun updateFieldVisibility() {
        if (!::formContent.isInitialized) return

        val visibleIndexes = when (state.mode) {
            MakerMode.LINEUP -> setOf(0, 1, 2, 3, 6, 7, 11, 14, 15)
            MakerMode.RESULT -> setOf(0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 14, 15)
            MakerMode.VIDEO -> setOf(0, 4, 5, 8, 14, 15)
            MakerMode.ROSTER -> setOf(0, 1, 2, 3, 6, 7, 12, 13, 14, 15)
        }

        for (index in 0 until formContent.childCount) {
            formContent.getChildAt(index).visibility = if (index in visibleIndexes) View.VISIBLE else View.GONE
        }
    }

    private fun spinner(label: String, values: List<String>, onSelected: (Int) -> Unit): View {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(8), 0, dp(4))
        }
        box.addView(TextView(this).apply {
            text = label
            setTextColor(Color.WHITE)
            textSize = 13f
        })
        box.addView(Spinner(this).apply {
            adapter = ArrayAdapter(this@MainActivity, android.R.layout.simple_spinner_dropdown_item, values)
            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                    onSelected(position)
                }

                override fun onNothingSelected(parent: AdapterView<*>?) = Unit
            }
        })
        return box
    }

    private fun input(label: String, value: String, onChange: (String) -> Unit): View {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(8), 0, dp(4))
        }
        box.addView(TextView(this).apply {
            text = label
            setTextColor(Color.WHITE)
            textSize = 13f
        })
        box.addView(EditText(this).apply {
            setText(value)
            setTextColor(Color.WHITE)
            setHintTextColor(Color.GRAY)
            setSingleLine(false)
            setBackgroundColor(Color.rgb(34, 34, 34))
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnFocusChangeListener { view, hasFocus ->
                if (!hasFocus) onChange((view as EditText).text.toString())
            }
        })
        return box
    }

    private fun pickVideo() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "video/*"
        }
        startActivityForResult(intent, PICK_VIDEO_REQUEST)
    }

    private fun savePosterPng() {
        thread {
            try {
                val bitmap = posterView.renderBitmap()
                val values = ContentValues().apply {
                    put(MediaStore.Images.Media.DISPLAY_NAME, "kia-maker-${System.currentTimeMillis()}.png")
                    put(MediaStore.Images.Media.MIME_TYPE, "image/png")
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        put(MediaStore.Images.Media.RELATIVE_PATH, "${Environment.DIRECTORY_PICTURES}/KIA Maker")
                        put(MediaStore.Images.Media.IS_PENDING, 1)
                    }
                }
                val uri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
                    ?: error("이미지 저장 URI를 만들지 못했습니다.")
                contentResolver.openOutputStream(uri)?.use { out ->
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
                } ?: error("이미지 저장 스트림을 열지 못했습니다.")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    values.clear()
                    values.put(MediaStore.Images.Media.IS_PENDING, 0)
                    contentResolver.update(uri, values, null, null)
                }
                status("PNG 저장 완료")
            } catch (error: Throwable) {
                try {
                    val file = savePosterPngFallback()
                    status("PNG fallback saved: ${file.absolutePath}")
                    return@thread
                } catch (_: Throwable) {
                    // Keep the original error message below if the fallback also fails.
                }
                status("PNG 저장 실패: ${error.message}")
            }
        }
    }

    private fun savePosterPngFallback(): File {
        val directory = File(getExternalFilesDir(Environment.DIRECTORY_PICTURES), "KIA Maker").apply {
            mkdirs()
        }
        val file = File(directory, "kia-maker-${System.currentTimeMillis()}.png")
        FileOutputStream(file).use { out ->
            posterView.renderBitmap().compress(Bitmap.CompressFormat.PNG, 100, out)
        }
        return file
    }

    private fun renderVideo() {
        val uri = selectedVideoUri
        if (uri == null) {
            status("먼저 영상을 선택해 주세요.")
            return
        }

        thread {
            try {
                status("오버레이 생성 중")
                val overlayBytes = ByteArrayOutputStream().also {
                    posterView.renderBitmap().compress(Bitmap.CompressFormat.PNG, 100, it)
                }.toByteArray()

                status("서버로 전송 중")
                val videoUrl = uploadRenderJob(uri, overlayBytes)
                status("MP4 다운로드 중")
                saveRenderedVideo(videoUrl)
                status("영상 저장 완료")
            } catch (error: Throwable) {
                status("영상 렌더 실패: ${error.message}")
            }
        }
    }

    private fun uploadRenderJob(videoUri: Uri, overlayBytes: ByteArray): String {
        val boundary = "KiaMaker${UUID.randomUUID()}"
        val server = state.serverUrl.trimEnd('/')
        val connection = URL("$server/api/render-video").openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.doOutput = true
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=$boundary")

        DataOutputStream(connection.outputStream).use { out ->
            out.writeField(boundary, "layout", """{"frame":{"x":90,"y":516,"width":900,"height":506}}""")
            out.writeField(boundary, "start", "0")
            out.writeField(boundary, "duration", "0")
            out.writeFile(boundary, "overlay", "overlay.png", "image/png", overlayBytes)
            out.writeFileHeader(boundary, "video", "source.mp4", "video/mp4")
            contentResolver.openInputStream(videoUri)?.use { input ->
                input.copyTo(out)
            }
            out.writeBytes("\r\n--$boundary--\r\n")
        }

        val response = connection.inputStream.bufferedReader().readText()
        val path = Regex(""""videoUrl"\s*:\s*"([^"]+)"""").find(response)?.groupValues?.get(1)
            ?: error("서버 응답에서 videoUrl을 찾지 못했습니다.")
        return URL(URL("$server/"), path).toString()
    }

    private fun saveRenderedVideo(videoUrl: String) {
        val values = ContentValues().apply {
            put(MediaStore.Video.Media.DISPLAY_NAME, "kia-maker-${System.currentTimeMillis()}.mp4")
            put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.Video.Media.RELATIVE_PATH, "${Environment.DIRECTORY_MOVIES}/KIA Maker")
                put(MediaStore.Video.Media.IS_PENDING, 1)
            }
        }
        val uri = contentResolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values)
            ?: error("영상 저장 URI를 만들지 못했습니다.")
        URL(videoUrl).openStream().use { input ->
            contentResolver.openOutputStream(uri)?.use { output ->
                input.copyTo(output)
            } ?: error("영상 저장 스트림을 열지 못했습니다.")
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            values.clear()
            values.put(MediaStore.Video.Media.IS_PENDING, 0)
            contentResolver.update(uri, values, null, null)
        }
    }

    private fun loadPlayerImage() {
        val number = state.playerNumber
        val url = "$GITHUB_ASSET_BASE/assets/player/$number.png"
        thread {
            try {
                URL(url).openStream().use { input ->
                    state.playerBitmap = BitmapFactory.decodeStream(BufferedInputStream(input))
                }
                runOnUiThread { posterView.invalidate() }
            } catch (_: Throwable) {
                state.playerBitmap = null
                runOnUiThread { posterView.invalidate() }
            }
        }
    }

    private fun playerNumber(name: String): Int = when (name.trim()) {
        "아데를린" -> 24
        "김도영" -> 5
        "김선빈" -> 3
        "나성범" -> 47
        else -> 24
    }

    private fun status(message: String) {
        runOnUiThread { statusText.text = message }
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}

private enum class MakerMode { LINEUP, RESULT, VIDEO, ROSTER }

private data class MakerState(
    var mode: MakerMode = MakerMode.RESULT,
    var playerName: String = "아데를린",
    var playerNumber: Int = 24,
    var teamCode: String = "lg",
    var title: String = "KIA TIGERS",
    var meta: String = "4타수 2안타 1홈런",
    var dateText: String = "2026.05.08",
    var opponentText: String = "vs LG 트윈스 · 광주",
    var awayScore: String = "3",
    var homeScore: String = "5",
    var winnerName: String = "양현종",
    var loserName: String = "상대투수",
    var saveName: String = "정해영",
    var lineupText: String = "1 박찬호 SS\n2 김선빈 2B\n3 김도영 3B\n4 최형우 DH\n5 나성범 RF\n6 아데를린 1B\n7 김태군 C\n8 최원준 CF\n9 이창진 LF",
    var callUpText: String = "아데를린 내야수\n김도현 투수",
    var sendDownText: String = "홍길동 내야수",
    var serverUrl: String = DEFAULT_SERVER_URL,
    var playerBitmap: Bitmap? = null
)

private class PosterView(
    context: android.content.Context,
    private val state: MakerState
) : View(context) {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val white = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE }
    private val dark = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(18, 18, 18) }
    private val backgroundCache = mutableMapOf<String, Bitmap?>()
    private val logoCache = mutableMapOf<String, Bitmap?>()
    private val pretendardRegular = font("fonts/Pretendard-Regular.ttf", Typeface.NORMAL)
    private val pretendardBold = font("fonts/Pretendard-Bold.ttf", Typeface.BOLD)
    private val pretendardLight = font("fonts/Pretendard-Light.ttf", Typeface.NORMAL)
    private val terminaBlack = font("fonts/Termina-Black.otf", Typeface.BOLD)
    private val boldFont = font("fonts/boldfont.ttf", Typeface.BOLD)
    private val mediumFont = font("fonts/medium-font.ttf", Typeface.NORMAL)
    private val regularFont = font("fonts/regular-font.ttf", Typeface.NORMAL)

    fun renderBitmap(): Bitmap {
        val bitmap = Bitmap.createBitmap(1080, 1350, Bitmap.Config.ARGB_8888)
        drawPoster(Canvas(bitmap), 1080f, 1350f)
        return bitmap
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val targetRatio = 1080f / 1350f
        val width = width.toFloat()
        val height = width / targetRatio
        canvas.save()
        canvas.translate(0f, ((this.height - height) / 2f).coerceAtLeast(0f))
        canvas.scale(width / 1080f, height / 1350f)
        drawPoster(canvas, 1080f, 1350f)
        canvas.restore()
    }

    private fun drawPoster(canvas: Canvas, w: Float, h: Float) {
        val bgColor = when (state.mode) {
            MakerMode.LINEUP -> Color.rgb(132, 10, 24)
            MakerMode.RESULT -> Color.rgb(176, 15, 34)
            MakerMode.VIDEO -> Color.rgb(24, 24, 24)
            MakerMode.ROSTER -> Color.rgb(102, 9, 18)
        }
        val background = backgroundForMode()
        if (background != null) {
            canvas.drawBitmap(background, null, RectF(0f, 0f, w, h), null)
        } else {
            canvas.drawColor(bgColor)
            paint.color = Color.argb(55, 255, 255, 255)
            canvas.drawRoundRect(RectF(54f, 54f, w - 54f, h - 54f), 28f, 28f, paint)
            paint.color = bgColor
            canvas.drawRoundRect(RectF(70f, 70f, w - 70f, h - 70f), 22f, 22f, paint)
        }

        logo("kia2")?.let { canvas.drawBitmap(it, null, RectF(0f, 0f, w, h), null) }
        logo("${state.teamCode}1")?.let { canvas.drawBitmap(it, null, RectF(0f, 0f, w, h), null) }

        state.playerBitmap?.let { bitmap ->
            val dest = RectF(0f, 0f, w, h)
            canvas.drawBitmap(bitmap, null, dest, null)
        }

        drawModeContent(canvas)
        return

        white.textAlign = Paint.Align.CENTER
        white.typeface = android.graphics.Typeface.DEFAULT_BOLD
        white.textSize = 82f
        canvas.drawText(labelForMode(), 540f, 160f, white)

        white.textSize = 62f
        canvas.drawText(state.title, 540f, 250f, white)

        dark.color = Color.argb(210, 0, 0, 0)
        canvas.drawRoundRect(RectF(110f, 1080f, 970f, 1245f), 20f, 20f, dark)

        white.typeface = android.graphics.Typeface.DEFAULT
        white.textSize = 38f
        canvas.drawText(state.dateText, 540f, 1138f, white)
        white.textSize = 34f
        canvas.drawText(state.opponentText, 540f, 1186f, white)
        white.textSize = 42f
        canvas.drawText(state.meta, 540f, 1310f, white)

        if (state.mode == MakerMode.VIDEO) {
            paint.style = Paint.Style.STROKE
            paint.strokeWidth = 8f
            paint.color = Color.WHITE
            canvas.drawRect(Rect(90, 516, 990, 1022), paint)
            paint.style = Paint.Style.FILL
        }
    }

    private fun labelForMode(): String = when (state.mode) {
        MakerMode.LINEUP -> "LINEUP"
        MakerMode.RESULT -> "RESULT"
        MakerMode.VIDEO -> "VIDEO"
        MakerMode.ROSTER -> "ROSTER"
    }

    private fun drawModeContent(canvas: Canvas) {
        when (state.mode) {
            MakerMode.RESULT -> drawResult(canvas)
            MakerMode.LINEUP -> drawLineup(canvas)
            MakerMode.ROSTER -> drawRoster(canvas)
            MakerMode.VIDEO -> drawVideo(canvas)
        }
    }

    private fun textPaint(size: Float, typeface: Typeface, align: Paint.Align = Paint.Align.LEFT): Paint {
        white.textSize = size
        white.typeface = typeface
        white.textAlign = align
        white.style = Paint.Style.FILL
        white.color = Color.WHITE
        return white
    }

    private fun baseline(top: Float, size: Float): Float = top + size * 0.92f

    private fun drawSpacedCentered(canvas: Canvas, text: String, centerX: Float, y: Float, spacing: Float, paint: Paint) {
        if (spacing == 0f) {
            val previous = paint.textAlign
            paint.textAlign = Paint.Align.CENTER
            canvas.drawText(text, centerX, y, paint)
            paint.textAlign = previous
            return
        }

        val chars = text.toList()
        val widths = chars.map { paint.measureText(it.toString()) }
        val total = widths.sum() + spacing * (chars.size - 1).coerceAtLeast(0)
        var cursor = centerX - total / 2f
        val previous = paint.textAlign
        paint.textAlign = Paint.Align.LEFT
        chars.forEachIndexed { index, char ->
            canvas.drawText(char.toString(), cursor, y, paint)
            cursor += widths[index] + spacing
        }
        paint.textAlign = previous
    }

    private fun drawResult(canvas: Canvas) {
        drawTopMeta(canvas)
        canvas.drawText(state.homeScore, 285f, baseline(532f, 140f), textPaint(140f, terminaBlack))
        canvas.drawText(state.awayScore, 285f, baseline(715f, 140f), textPaint(140f, terminaBlack))

        fun badge(label: String, x: Float, y: Float, color: Int) {
            paint.color = color
            paint.style = Paint.Style.FILL
            canvas.drawRect(RectF(x, y, x + 42f, y + 42f), paint)
            canvas.drawText(label, x + 21f, y + 31f, textPaint(31f, pretendardBold, Paint.Align.CENTER))
        }
        if (state.winnerName.isNotBlank()) {
            badge("W", 68f, 957f, Color.rgb(106, 199, 0))
            canvas.drawText(state.winnerName, 127f, baseline(959f, 33f), textPaint(33f, pretendardBold))
        }
        if (state.loserName.isNotBlank()) {
            badge("L", 68f, 1008f, Color.rgb(202, 0, 0))
            canvas.drawText(state.loserName, 127f, baseline(1011f, 33f), textPaint(33f, pretendardBold))
        }
        if (state.saveName.isNotBlank()) {
            badge("S", 68f, 1059f, Color.rgb(226, 181, 0))
            canvas.drawText(state.saveName, 127f, baseline(1062f, 33f), textPaint(33f, pretendardBold))
        }

        canvas.drawText(state.playerName, 252f, baseline(1120f, 39f), textPaint(39f, pretendardBold))
        if (state.meta.isNotBlank()) {
            canvas.drawText("(${state.meta})", 252f + white.measureText(state.playerName) + 12f, baseline(1135f, 20f), textPaint(20f, pretendardRegular))
        }
    }

    private fun drawLineup(canvas: Canvas) {
        drawTopMeta(canvas)
        val nameY = floatArrayOf(480f, 553f, 624f, 695f, 768f, 840f, 912f, 985f, 1056f)
        val posY = floatArrayOf(475f, 548f, 619f, 690f, 763f, 835f, 907f, 980f, 1051f)
        state.lineupText.lines().filter { it.isNotBlank() }.take(9).forEachIndexed { index, raw ->
            val parts = raw.trim().split(Regex("\\s+"))
            val name = parts.drop(1).dropLast(1).joinToString(" ").ifBlank { parts.getOrNull(1) ?: raw.trim() }
            val pos = parts.lastOrNull().orEmpty()
            canvas.drawText(name, 167f, baseline(nameY[index], 47f), textPaint(47f, boldFont))
            canvas.drawText(pos, 399f, baseline(posY[index], 49f), textPaint(49f, boldFont))
        }
        canvas.drawText(state.playerName, 163f, baseline(1144f, 45f), textPaint(45f, pretendardBold))
    }

    private fun drawRoster(canvas: Canvas) {
        drawTopMeta(canvas)
        canvas.drawText("CALL-UP", 62f, baseline(470f, 53f), textPaint(53f, terminaBlack))
        canvas.drawText("SEND-DOWN", 62f, baseline(859f, 53f), textPaint(53f, terminaBlack))
        state.callUpText.lines().filter { it.isNotBlank() }.take(4).forEachIndexed { index, line ->
            canvas.drawText(line.trim(), 270f, baseline(578f + index * 66f, 52f), textPaint(52f, boldFont))
        }
        state.sendDownText.lines().filter { it.isNotBlank() }.take(4).forEachIndexed { index, line ->
            canvas.drawText(line.trim(), 270f, baseline(976f + index * 66f, 52f), textPaint(52f, boldFont))
        }
    }

    private fun drawVideo(canvas: Canvas) {
        val titlePaint = textPaint(77f, boldFont, Paint.Align.CENTER).apply { color = Color.rgb(17, 17, 17) }
        state.title.lines().take(2).forEachIndexed { index, line ->
            drawSpacedCentered(canvas, line, 540f, baseline(246f, 77f) + index * 93f, -3f, titlePaint)
        }
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 8f
        paint.color = Color.argb(170, 255, 255, 255)
        canvas.drawRect(Rect(90, 516, 990, 1022), paint)
        paint.style = Paint.Style.FILL
        val metaPaint = textPaint(40f, mediumFont, Paint.Align.CENTER).apply { color = Color.rgb(17, 17, 17) }
        state.meta.lines().take(2).forEachIndexed { index, line ->
            canvas.drawText(line, 540f, baseline(1107f, 40f) + index * 54f, metaPaint)
        }
    }

    private fun drawTopMeta(canvas: Canvas) {
        val parts = state.opponentText.split("·", limit = 2)
        val opponent = parts.firstOrNull()?.trim().orEmpty()
        val stadium = parts.getOrNull(1)?.trim().orEmpty()
        canvas.drawText(state.dateText, 66f, baseline(354f, 29f), textPaint(29f, pretendardRegular))
        canvas.drawText(opponent, 7.5f + 66f + white.measureText(state.dateText), baseline(354f, 28f), textPaint(28f, pretendardBold))
        if (stadium.isNotBlank()) {
            canvas.drawText(stadium, 66f, baseline(391f, 29f), textPaint(29f, pretendardLight))
        }
    }

    private fun backgroundForMode(): Bitmap? {
        val path = when (state.mode) {
            MakerMode.LINEUP -> "background/bg-lineup.png"
            MakerMode.RESULT -> "background/bg-win.png"
            MakerMode.VIDEO -> "background/bg-video.png"
            MakerMode.ROSTER -> "background/bg-rostermoves.png"
        }
        return backgroundCache.getOrPut(path) { loadAsset(path) }
    }

    private fun logo(name: String): Bitmap? {
        val path = "logo/$name.png"
        return logoCache.getOrPut(path) { loadAsset(path) }
    }

    private fun font(path: String, fallbackStyle: Int): Typeface = try {
        Typeface.createFromAsset(context.assets, path)
    } catch (_: Throwable) {
        Typeface.create(Typeface.DEFAULT, fallbackStyle)
    }

    private fun loadAsset(path: String): Bitmap? = try {
        context.assets.open(path).use { BitmapFactory.decodeStream(it) }
    } catch (_: Throwable) {
        null
    }
}

private data class PlayerOption(val name: String, val number: Int)
private data class TeamOption(val name: String, val stadium: String, val code: String)

private val PLAYER_OPTIONS = listOf(
    PlayerOption("아데를린", 24),
    PlayerOption("김도영", 5),
    PlayerOption("김선빈", 3),
    PlayerOption("나성범", 47),
    PlayerOption("박찬호", 1),
    PlayerOption("최형우", 34),
    PlayerOption("김태군", 42),
    PlayerOption("정해영", 62),
    PlayerOption("양현종", 54),
    PlayerOption("네일", 40)
)

private val TEAM_OPTIONS = listOf(
    TeamOption("LG 트윈스", "잠실 야구장", "lg"),
    TeamOption("두산 베어스", "잠실 야구장", "doo"),
    TeamOption("키움 히어로즈", "고척 스카이돔", "kiw"),
    TeamOption("SSG 랜더스", "인천 SSG 랜더스필드", "ssg"),
    TeamOption("KT 위즈", "수원 KT위즈파크", "kt"),
    TeamOption("한화 이글스", "대전 한화생명 볼파크", "han"),
    TeamOption("롯데 자이언츠", "사직 야구장", "lot"),
    TeamOption("NC 다이노스", "창원 NC파크", "nc"),
    TeamOption("삼성 라이온즈", "대구 삼성 라이온즈파크", "sam")
)

private fun DataOutputStream.writeField(boundary: String, name: String, value: String) {
    writeBytes("--$boundary\r\n")
    writeBytes("Content-Disposition: form-data; name=\"$name\"\r\n\r\n")
    writeBytes(value)
    writeBytes("\r\n")
}

private fun DataOutputStream.writeFile(
    boundary: String,
    name: String,
    fileName: String,
    mimeType: String,
    bytes: ByteArray
) {
    writeFileHeader(boundary, name, fileName, mimeType)
    write(bytes)
    writeBytes("\r\n")
}

private fun DataOutputStream.writeFileHeader(
    boundary: String,
    name: String,
    fileName: String,
    mimeType: String
) {
    writeBytes("--$boundary\r\n")
    writeBytes("Content-Disposition: form-data; name=\"$name\"; filename=\"$fileName\"\r\n")
    writeBytes("Content-Type: $mimeType\r\n\r\n")
}
