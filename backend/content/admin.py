from django.contrib import admin
from .models import Course, Module, Lesson

class LessonInline(admin.TabularInline):
    model = Lesson; extra = 1
    fields = ('title', 'content_type', 'order', 'duration_minutes', 'unlock_strategy')

class ModuleInline(admin.TabularInline):
    model = Module; extra = 1
    fields = ('title', 'order')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'target_role', 'is_active')
    list_filter = ('status', 'target_role')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ModuleInline]
    fieldsets = (
        ('Informações', {'fields': ('title', 'slug', 'description', 'cover_image')}),
        ('Acesso', {'fields': ('status', 'target_role', 'is_active')}),
    )

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'content_type', 'order', 'unlock_strategy')
    list_filter = ('content_type', 'unlock_strategy', 'module__course')
    search_fields = ('title', 'content_html')
    filter_horizontal = ('prerequisites',)
    fieldsets = (
        ('Básico', {'fields': ('module', 'title', 'content_type', 'order', 'duration_minutes')}),
        ('Conteúdo', {'fields': ('content_html', 'video_url', 'pdf_file')}),
        ('Bloqueio e Pré-requisitos', {'fields': ('unlock_strategy', 'prerequisites', 'release_date')}),
    )
