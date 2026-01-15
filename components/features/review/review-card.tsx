"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { submitReview } from "@/server/actions/review-actions"

interface Member {
  id: string
  name: string
  role: string
  avatarUrl?: string
}

export function ReviewCard({ member }: { member: Member }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false) // Trạng thái đã đánh giá xong

  const handleSubmit = async () => {
    // Validate nhanh ở Client để đỡ gọi server nếu chưa chọn sao
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.")
      return
    }
    if (rating <= 2 && comment.length < 10) {
      toast.error("Điểm thấp cần nhập lý do chi tiết (tối thiểu 10 ký tự).")
      return
    }

    setIsSubmitting(true)
    const res = await submitReview({ revieweeId: member.id, rating, comment })
    setIsSubmitting(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Đã đánh giá ${member.name} thành công!`)
      setIsDone(true) // Chuyển sang giao diện "Đã xong"
    }
  }

  // Giao diện khi đã đánh giá xong (Card biến thành màu xanh)
  if (isDone) {
    return (
      <Card className="bg-green-50 border-green-200 flex flex-col items-center justify-center py-10 h-full transition-all duration-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-green-800 font-semibold text-lg">Đã đánh giá</h3>
        <p className="text-green-600">{member.name}</p>
        <div className="flex mt-2">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
            ))}
        </div>
      </Card>
    )
  }

  // Giao diện Form đánh giá
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12 border">
            <AvatarImage src={member.avatarUrl} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="font-semibold text-lg leading-none">{member.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-1 inline-block">
                {member.role}
            </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 flex-1 flex flex-col">
        {/* Star Rating Area */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="group focus:outline-none transition-transform active:scale-95"
                    >
                        <Star 
                            className={cn(
                                "w-8 h-8 transition-colors duration-200", 
                                star <= rating 
                                    ? "fill-amber-400 text-amber-400 drop-shadow-sm" 
                                    : "text-gray-300 group-hover:text-amber-200"
                            )} 
                        />
                    </button>
                ))}
            </div>
            <span className={cn(
                "text-xs mt-2 font-medium transition-colors",
                rating === 0 ? "text-muted-foreground" : "text-amber-600"
            )}>
                {rating === 0 ? "Chạm để đánh giá" : 
                 rating === 5 ? "Xuất sắc (5/5)" : 
                 rating === 1 ? "Cần cải thiện (1/5)" : `Đánh giá ${rating}/5 sao`}
            </span>
        </div>

        {/* Comment Area */}
        <div className="space-y-2 flex-1">
          <div className="flex justify-between">
            <Label htmlFor={`comment-${member.id}`} className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                Nhận xét {rating > 0 && rating <= 2 && <span className="text-red-500">*</span>}
            </Label>
          </div>
          <Textarea 
            id={`comment-${member.id}`}
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder={rating <= 2 ? "Hãy cho biết lý do bạn đánh giá thấp..." : "Lời khen hoặc góp ý (tuỳ chọn)..."}
            className={cn(
                "resize-none min-h-[100px] focus-visible:ring-offset-0",
                rating <= 2 && comment.length < 10 && "border-red-200 focus-visible:ring-red-400 bg-red-50/30"
            )}
          />
          {rating <= 2 && comment.length < 10 && (
             <p className="text-[10px] text-red-500 font-medium animate-pulse">
                * Bắt buộc nhập tối thiểu 10 ký tự cho điểm thấp.
             </p>
          )}
        </div>

        <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700"
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...
                </>
            ) : "Gửi đánh giá"}
        </Button>
      </CardContent>
    </Card>
  )
}