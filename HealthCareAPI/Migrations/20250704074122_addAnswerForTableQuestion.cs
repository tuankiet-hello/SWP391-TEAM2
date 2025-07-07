using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCareAPI.Migrations
{
    /// <inheritdoc />
    public partial class addAnswerForTableQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Questions",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Questions",
                newName: "Content");
        }
    }
}
